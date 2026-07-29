import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: any;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const user = await this.usersService.findById(id);
    return user;
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string, @Req() req: AuthenticatedRequest) {
    const user = await this.usersService.findByEmail(email);
    return user;
  }
}