import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { NotificationsService } from '@/notifications/notifications.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, createEventDto: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: {
        message: createEventDto.message,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Trigger notification
    this.notificationsService.sendInAppNotification(
      userId,
      'New Event Recorded',
      event.message
    );

    return event;
  }

  async findAll(userId: string) {
    const events = await this.prisma.event.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return events;
  }

  async findTodayEvents(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.event.count({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
    });
  }

  async getTotalEvents(userId: string) {
    return this.prisma.event.count({
      where: {
        userId,
      },
    });
  }
}