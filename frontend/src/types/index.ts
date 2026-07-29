export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ActivityEvent {
  id: string;
  message: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface EventStats {
  totalEvents: number;
  todayEvents: number;
  connectedUsers: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
}