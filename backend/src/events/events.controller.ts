import { Controller, Get, Post, Body, UseGuards, Req, Ip } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { SocketGateway } from '../socket/socket.gateway';

interface AuthenticatedRequest extends Request {
  user: any;
}

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(
    private eventsService: EventsService,
    private socketGateway: SocketGateway,
  ) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto, @Req() req: AuthenticatedRequest, @Ip() ip: string) {
    const event = await this.eventsService.create(req.user.id, createEventDto);

    // Broadcast to all connected clients via Socket.IO
    this.socketGateway.broadcastNewEvent(event);

    return event;
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    const events = await this.eventsService.findAll(req.user.id);
    return events;
  }

  @Get('stats')
  async getStats(@Req() req: AuthenticatedRequest) {
    const totalEvents = await this.eventsService.getTotalEvents(req.user.id);
    const todayEvents = await this.eventsService.findTodayEvents(req.user.id);

    return {
      totalEvents,
      todayEvents,
      connectedUsers: this.socketGateway.getConnectedUsersCount(),
    };
  }
}