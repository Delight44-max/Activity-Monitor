import { Injectable, Logger } from '@nestjs/common';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private notifications: Map<string, Notification[]> = new Map();

  constructor() {}

  sendInAppNotification(userId: string, title: string, message: string) {
    const notification: Notification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      message,
      read: false,
      createdAt: new Date(),
    };

    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (userNotifications.length > 50) {
      userNotifications.pop();
    }
    
    this.notifications.set(userId, userNotifications);

    this.logger.log(`📬 Sending In-App Notification:
New Event Recorded`);
    this.logger.log(`User: ${userId}`);
    this.logger.log(`Message: ${message}`);

    return notification;
  }

  getUserNotifications(userId: string): Notification[] {
    return this.notifications.get(userId) || [];
  }

  markAsRead(userId: string, notificationId: string) {
    const userNotifications = this.notifications.get(userId) || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    return notification;
  }

  markAllAsRead(userId: string) {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.forEach(n => n.read = true);
    this.notifications.set(userId, userNotifications);
    return userNotifications;
  }

  getUnreadCount(userId: string): number {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter(n => !n.read).length;
  }
}