'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Bell,
  LogOut,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  RefreshCw,
  TrendingUp,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { eventsService } from '@/src/services/events.service';
import { getSocket } from '@/src/services/socket.service';
import { ActivityEvent, EventStats, Notification } from '@/src/types';
import { Card, CardContent, CardHeader } from '@/src/components/ui/Card';
import { Avatar } from '@/src/components/ui/Avatar';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { AnimatedCounter } from '@/src/components/ui/AnimatedCounter';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { CardSkeleton, EventSkeleton } from '@/src/components/ui/Skeleton';
import Button from '@/src/components/ui/Button';
import toast from 'react-hot-toast';
import {
  getRelativeTime,
  formatTime,
  getEventIcon,
  getEventColor,
  getRandomEventMessage,
} from '@/src/lib/utils';
import { useDebounce } from '@/src/hooks/useDebounce';

type SortOption = 'newest' | 'oldest';
type FilterOption = 'all' | 'today' | 'week';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [stats, setStats] = useState<EventStats>({
    totalEvents: 0,
    todayEvents: 0,
    connectedUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [page, setPage] = useState(1);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const perPage = 10;

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchData = useCallback(async () => {
    try {
      const [eventsData, statsData] = await Promise.all([
        eventsService.getAll(),
        eventsService.getStats(),
      ]);
      setEvents(eventsData);
      setStats(statsData);
    } catch {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Socket listeners
  useEffect(() => {
    if (!socketReady) return;

    const socket = getSocket();
    if (!socket) return;

    console.log('📡 Attaching socket listeners');

    const handleNewEvent = (event: ActivityEvent) => {
      console.log('📨 Received eventCreated:', event.message);
      setEvents((prev) => [event, ...prev]);
      setStats((prev) => ({
        ...prev,
        totalEvents: prev.totalEvents + 1,
        todayEvents: prev.todayEvents + 1,
      }));
      setNotifications((prev) => [
        {
          id: event.id,
          userId: event.userId,
          title: 'New Event Recorded',
          message: event.message,
          read: false,
          createdAt: event.createdAt,
        },
        ...prev,
      ]);
    };

    const handleConnectedUsers = (count: number) => {
      console.log('👥 Received connectedUsersCount:', count);
      setStats((prev) => ({ ...prev, connectedUsers: count }));
    };

    socket.on('eventCreated', handleNewEvent);
    socket.on('connectedUsersCount', handleConnectedUsers);

    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('eventCreated', handleNewEvent);
      socket.off('connectedUsersCount', handleConnectedUsers);
    };
  }, [socketReady]);

  // Monitor socket connection
  useEffect(() => {
    const checkSocket = setInterval(() => {
      const socket = getSocket();
      if (socket?.connected) {
        setSocketReady(true);
        clearInterval(checkSocket);
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => clearInterval(checkSocket), 5000);

    return () => clearInterval(checkSocket);
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const message = getRandomEventMessage();
      console.log('🎯 Simulating event:', message);
      await eventsService.create({ message });
      
      // Optimistically update stats immediately
      setStats((prev) => ({
        ...prev,
        totalEvents: prev.totalEvents + 1,
        todayEvents: prev.todayEvents + 1,
      }));
      
      toast.success('Event simulated successfully!');
      console.log('✅ Event simulated, waiting for socket broadcast...');
    } catch (error) {
      console.error('❌ Failed to simulate event:', error);
      // Error handled by interceptor
    } finally {
      setSimulating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Filtering, searching, sorting
  const processedEvents = events
    .filter((e) => {
      if (filterBy === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(e.createdAt) >= today;
      }
      if (filterBy === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(e.createdAt) >= weekAgo;
      }
      return true;
    })
    .filter((e) =>
      debouncedSearch
        ? e.message.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          e.user.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          e.user.lastName.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true,
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(processedEvents.length / perPage);
  const paginatedEvents = processedEvents.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-500">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="hidden text-lg font-bold sm:block">
              Activity<span className="text-primary">Monitor</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 rounded-2xl border border-border bg-card shadow-2xl"
                  >
                    <div className="border-b border-border p-4">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n.id}
                            className={`border-b border-border p-4 transition-colors hover:bg-muted/50 ${
                              !n.read ? 'bg-primary/5' : ''
                            }`}
                          >
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {n.message}
                            </p>
                            <p className="mt-1 text-[10px] text-muted-foreground/60">
                              {getRelativeTime(n.createdAt)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ThemeToggle />

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 pr-3 transition-colors hover:bg-accent"
              >
                <Avatar
                  firstName={user?.firstName || ''}
                  lastName={user?.lastName || ''}
                  size="sm"
                />
                <span className="hidden text-sm font-medium sm:block">
                  {user?.firstName}
                </span>
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-56 rounded-2xl border border-border bg-card shadow-2xl"
                  >
                    <div className="border-b border-border p-4">
                      <p className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="mt-1 text-3xl font-bold">
                    <AnimatedCounter end={stats.totalEvents} />
                  </p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Events</p>
                  <p className="mt-1 text-3xl font-bold">
                    <AnimatedCounter end={stats.todayEvents} />
                  </p>
                </div>
                <div className="rounded-xl bg-green-500/10 p-3 text-green-500">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connected Users</p>
                  <p className="mt-1 text-3xl font-bold">
                    <AnimatedCounter end={stats.connectedUsers} />
                  </p>
                </div>
                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const options: FilterOption[] = ['all', 'today', 'week'];
                  const idx = options.indexOf(filterBy);
                  setFilterBy(options[(idx + 1) % options.length]);
                  setPage(1);
                }}
                className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:block">
                  {filterBy === 'all' ? 'All Time' : filterBy === 'today' ? 'Today' : 'This Week'}
                </span>
              </button>

              <button
                onClick={() => {
                  setSortBy(sortBy === 'newest' ? 'oldest' : 'newest');
                  setPage(1);
                }}
                className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:block">
                  {sortBy === 'newest' ? 'Newest' : 'Oldest'}
                </span>
              </button>
            </div>
          </div>

          <Button onClick={handleSimulate} loading={simulating} icon={<Plus className="h-4 w-4" />}>
            Simulate Event
          </Button>
        </div>

        {/* Event Feed */}
        <div className="space-y-3">
          {paginatedEvents.length === 0 ? (
            <EmptyState
              title="No events found"
              description={
                debouncedSearch
                  ? 'Try a different search term'
                  : 'Create your first event to start monitoring'
              }
              action={
                !debouncedSearch ? (
                  <Button onClick={handleSimulate} loading={simulating} size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Create Event
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <AnimatePresence mode="popLayout">
              {paginatedEvents.map((event) => {
                const { icon: iconName, color } = getEventIcon(event.message);
                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${getEventColor(color)}`}
                    >
                      <Activity className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {event.message}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatTime(event.createdAt)}</span>
                        <span>·</span>
                        <span>
                          {event.user.firstName} {event.user.lastName}
                        </span>
                        <span>·</span>
                        <span>{getRelativeTime(event.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-muted-foreground">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border bg-card text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}