import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return 'just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getRandomEventMessage(): string {
  const messages = [
    'User logged in from new device',
    'New purchase order created',
    'API rate limit exceeded',
    'Database backup completed',
    'User profile updated',
    'Payment processed successfully',
    'New user registration',
    'Password changed successfully',
    'File upload completed',
    'Session expired',
    'Email verification sent',
    'Account settings updated',
    'New team member added',
    'Integration connected',
    'Report generated',
    'Subscription upgraded',
    'Two-factor authentication enabled',
    'Data export requested',
    'Cache cleared successfully',
    'Webhook configuration updated',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getEventIcon(message: string): {
  icon: string;
  color: string;
} {
  const lower = message.toLowerCase();
  if (lower.includes('login') || lower.includes('session'))
    return { icon: 'log-in', color: 'blue' };
  if (lower.includes('error') || lower.includes('exceeded') || lower.includes('expired'))
    return { icon: 'alert-circle', color: 'red' };
  if (lower.includes('payment') || lower.includes('purchase'))
    return { icon: 'credit-card', color: 'green' };
  if (lower.includes('registration') || lower.includes('signup'))
    return { icon: 'user-plus', color: 'purple' };
  if (lower.includes('backup') || lower.includes('upload') || lower.includes('export'))
    return { icon: 'upload', color: 'orange' };
  if (lower.includes('password') || lower.includes('security'))
    return { icon: 'shield', color: 'indigo' };
  if (lower.includes('email') || lower.includes('verification'))
    return { icon: 'mail', color: 'pink' };
  if (lower.includes('upgrade') || lower.includes('subscription'))
    return { icon: 'zap', color: 'yellow' };
  if (lower.includes('integration') || lower.includes('webhook'))
    return { icon: 'link', color: 'cyan' };
  return { icon: 'activity', color: 'slate' };
}

export function getEventColor(color: string): string {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400',
  };
  return colors[color] || colors.slate;
}