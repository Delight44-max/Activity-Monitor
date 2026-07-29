import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../../src/notifications/notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendInAppNotification', () => {
    it('should send a notification and log it', () => {
      const userId = 'user-id';
      const title = 'New Event Recorded';
      const message = 'Test event message';

      const notification = service.sendInAppNotification(userId, title, message);

      expect(notification).toHaveProperty('id');
      expect(notification.userId).toBe(userId);
      expect(notification.title).toBe(title);
      expect(notification.message).toBe(message);
      expect(notification.read).toBe(false);
    });

    it('should store notification for user', () => {
      const userId = 'user-id';
      const title = 'Test';
      const message = 'Message';

      service.sendInAppNotification(userId, title, message);
      const notifications = service.getUserNotifications(userId);

      expect(notifications.length).toBe(1);
      expect(notifications[0].title).toBe(title);
    });

    it('should keep only last 50 notifications', () => {
      const userId = 'user-id';

      for (let i = 0; i < 55; i++) {
        service.sendInAppNotification(userId, `Title ${i}`, `Message ${i}`);
      }

      const notifications = service.getUserNotifications(userId);
      expect(notifications.length).toBeLessThanOrEqual(50);
    });
  });

  describe('getUserNotifications', () => {
    it('should return empty array for user with no notifications', () => {
      const notifications = service.getUserNotifications('new-user');
      expect(notifications).toEqual([]);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', () => {
      const userId = 'user-id';
      const notification = service.sendInAppNotification(userId, 'Title', 'Message');
      
      const updated = service.markAsRead(userId, notification.id);
      expect(updated?.read).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', () => {
      const userId = 'user-id';
      service.sendInAppNotification(userId, 'Title 1', 'Message 1');
      service.sendInAppNotification(userId, 'Title 2', 'Message 2');

      service.markAllAsRead(userId);
      const notifications = service.getUserNotifications(userId);

      expect(notifications.every(n => n.read)).toBe(true);
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of unread notifications', () => {
      const userId = 'user-id';
      service.sendInAppNotification(userId, 'Title 1', 'Message 1');
      service.sendInAppNotification(userId, 'Title 2', 'Message 2');
      
      service.markAsRead(userId, service.getUserNotifications(userId)[0].id);

      const unreadCount = service.getUnreadCount(userId);
      expect(unreadCount).toBe(1);
    });
  });
});