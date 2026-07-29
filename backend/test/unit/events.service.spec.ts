import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from '../../src/events/events.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NotificationsService } from '../../src/notifications/notifications.service';

describe('EventsService', () => {
  let service: EventsService;
  let prisma: PrismaService;
  let notificationsService: NotificationsService;

  const mockPrismaService = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockNotificationsService = {
    sendInAppNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event and trigger notification', async () => {
      const userId = 'user-id';
      const createEventDto = { message: 'Test event' };

      const mockEvent = {
        id: 'event-id',
        message: createEventDto.message,
        userId,
        createdAt: new Date(),
        user: {
          id: userId,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        },
      };

      mockPrismaService.event.create.mockResolvedValue(mockEvent);
      mockNotificationsService.sendInAppNotification.mockResolvedValue({});

      const result = await service.create(userId, createEventDto);

      expect(result).toEqual(mockEvent);
      expect(notificationsService.sendInAppNotification).toHaveBeenCalledWith(
        userId,
        'New Event Recorded',
        createEventDto.message
      );
    });
  });

  describe('findAll', () => {
    it('should return events in descending order', async () => {
      const userId = 'user-id';
      const mockEvents = [
        {
          id: 'event-1',
          message: 'Latest event',
          userId,
          createdAt: new Date(),
          user: { id: userId, firstName: 'Test', lastName: 'User', email: 'test@example.com' },
        },
        {
          id: 'event-2',
          message: 'Earlier event',
          userId,
          createdAt: new Date(Date.now() - 1000),
          user: { id: userId, firstName: 'Test', lastName: 'User', email: 'test@example.com' },
        },
      ];

      mockPrismaService.event.findMany.mockResolvedValue(mockEvents);

      const result = await service.findAll(userId);
      expect(result).toEqual(mockEvents);
    });
  });

  describe('stats', () => {
    it('should return total events count', async () => {
      const userId = 'user-id';
      mockPrismaService.event.count.mockResolvedValue(10);

      const result = await service.getTotalEvents(userId);
      expect(result).toBe(10);
    });
  });
});