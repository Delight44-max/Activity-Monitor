import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  private connectedUsers: Map<string, string[]> = new Map();
  private userSockets: Map<string, string[]> = new Map();

  async handleConnection(@ConnectedSocket() client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        console.warn('⚠️ Socket connection rejected: no token provided');
        client.disconnect();
        return;
      }

      // Verify JWT using NestJS JWT service
  const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      client.userId = userId;
      
      this.connectedUsers.set(userId, [
        ...(this.connectedUsers.get(userId) || []),
        client.id,
      ]);
      this.userSockets.set(client.id, [userId]);

      console.log(`✅ User connected: ${userId}`);
      this.updateConnectedUsersCount();
    } catch (error) {
      console.error('❌ Socket connection error: Invalid or expired token', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: AuthenticatedSocket) {
    const userId = client.userId;
    
    if (userId) {
      const userConnections = this.connectedUsers.get(userId) || [];
      const filteredConnections = userConnections.filter(id => id !== client.id);
      
      if (filteredConnections.length === 0) {
        this.connectedUsers.delete(userId);
      } else {
        this.connectedUsers.set(userId, filteredConnections);
      }
      
      this.userSockets.delete(client.id);
      console.log(`🔌 User disconnected: ${userId}`);
      this.updateConnectedUsersCount();
    }
  }

  broadcastNewEvent(event: any) {
    this.server.emit('eventCreated', event);
  }

  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  private updateConnectedUsersCount() {
    this.server.emit('connectedUsersCount', this.connectedUsers.size);
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() userId: string) {
    client.join(userId);
    return { event: 'joined', data: userId };
  }
}