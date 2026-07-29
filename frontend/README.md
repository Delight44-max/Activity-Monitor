# ActivityMonitor - Frontend

Real-time activity monitoring dashboard built with Next.js 15, React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Real-Time:** Socket.IO Client
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Charts:** Recharts
- **Theme:** next-themes (custom implementation)

## Features

- 🔐 **JWT Authentication** - Register, Login, Logout with persistent sessions
- 🏠 **Premium Landing Page** - Animated hero, features, testimonials, CTA
- 📊 **Real-Time Dashboard** - Live event feed with WebSocket updates
- 🔔 **In-App Notifications** - Instant notification on new events
- 🔍 **Search & Filter** - Search events, filter by time, sort by date
- 📱 **Fully Responsive** - Mobile, tablet, desktop, ultra-wide
- 🌓 **Dark/Light Mode** - Persistent theme preference
- ⚡ **Animated Counters** - Smooth number animations
- 🎯 **Loading Skeletons** - Beautiful loading states
- 🚫 **404 Page** - Custom error page
- 🛡️ **Error Boundary** - Graceful error handling
- ♿ **Accessible** - Keyboard navigation, ARIA labels

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── dashboard/         # Protected dashboard
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── not-found.tsx      # 404 page
│   └── error.tsx          # Error boundary
├── components/
│   ├── landing/           # Landing page components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts (Auth, Theme)
├── hooks/                 # Custom hooks
├── lib/                   # Utilities and validations
├── services/              # API and Socket services
└── types/                 # TypeScript types
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/events` | Get all events |
| POST | `/api/events` | Create event |
| GET | `/api/events/stats` | Get event statistics |

## Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `eventCreated` | Server → Client | New event created |
| `connectedUsersCount` | Server → Client | Connected users count |

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

```bash
vercel --prod
```

### Question 1: Supporting Native iOS and Android Applications

To support native iOS and Android applications, I would recommend using **React Native with Expo** sharing the same NestJS backend. This approach provides:

- **Code sharing** - Business logic, types, and API services can be shared between web and mobile
- **Same backend** - The existing NestJS API and Socket.IO infrastructure works unchanged
- **Expo ecosystem** - Easy deployment, OTA updates, and native module access
- **Consistent auth** - JWT tokens work identically across platforms

The mobile app would use the same authentication flow, Socket.IO client, and API endpoints, with platform-specific UI built using React Native components.

### Question 2: Push Notifications vs SMS vs WhatsApp

**Push Notifications**
- **When to use:** Real-time updates, in-app alerts, user engagement
- **Pros:** Free, instant, rich media support, works offline
- **Cons:** Requires app installation, platform-dependent
- **Cost:** Free (FCM/APNs)

**SMS**
- **When to use:** Critical alerts, password resets, verification codes
- **Pros:** Universal reach, no app needed, high open rate
- **Cons:** Character limit, no rich media, delayed delivery
- **Cost:** $0.01-0.05 per message

**WhatsApp**
- **When to use:** Customer support, order updates, marketing
- **Pros:** Rich media, read receipts, high engagement
- **Cons:** Requires WhatsApp account, business verification
- **Cost:** Free for service messages, paid for marketing

**Recommendation:** Use push notifications for real-time updates, SMS for critical alerts, and WhatsApp for customer communication. Consider cost vs. reach when choosing.


**ARCHITECTURE:** Yes, this app uses **Event-Driven Architecture (EDA)**, specifically with a real-time event streaming pattern. Here's why:

## Evidence of Event-Driven Architecture:

### 1. **Socket.IO Event Broadcasting**
The backend has a dedicated Socket Gateway (`backend/src/socket/socket.gateway.ts`) that broadcasts events to all connected clients:
- When events are created via API, they're broadcast via `socketGateway.broadcastNewEvent(event)`
- Dashboard clients receive `eventCreated` events in real-time
- `connectedUsersCount` is tracked and broadcast

### 2. **Event-Centric Data Model**
The core domain is built around **Activity Events**:
- Events are created, stored, and then streamed
- Stats are derived from event counts (total, today's, connected users)
- The entire dashboard visualizes event streams

### 3. **Publisher-Subscriber Pattern**
- **Publishers**: EventsController creates events via HTTP API
- **Broker**: Socket.IO gateway broadcasts to all subscribers
- **Subscribers**: Dashboard clients listen for `eventCreated` and `connectedUsersCount`

### 4. **Decoupled Communication**
The frontend receives updates without polling:
```typescript
socket.on('eventCreated', handleNewEvent);
socket.on('connectedUsersCount', handleConnectedUsers);
```

## Architecture Stack:
- **Backend**: NestJS (Node.js) with Socket.IO gateway
- **Frontend**: Next.js with real-time Socket.IO client
- **Database**: Prisma/PostgreSQL for event persistence
- **Real-time**: WebSocket (Socket.IO) for live updates

## Additional Patterns:
- **REST API** for synchronous operations (CRUD, auth)
- **JWT Authentication** for securing both HTTP and WebSocket connections
- **Firebase** for Google OAuth (external identity provider)

This is a **hybrid architecture**: REST for traditional request-response, plus Event-Driven for real-time monitoring.