import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(private jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      // Validate JWT token from handshake
      const token = client.handshake.auth?.token;
      
      if (!token) {
        console.log('[WebSocket] Connection rejected - missing token');
        client.disconnect();
        return;
      }

      // Verify and decode JWT
      const payload = this.jwtService.verify(token);
      const userId = payload.userId;
      const tenantId = payload.tenantId;
      
      if (!userId || !tenantId) {
        console.log('[WebSocket] Connection rejected - invalid token payload');
        client.disconnect();
        return;
      }

      // Store validated user info on socket
      client.data.userId = userId;
      client.data.tenantId = tenantId;
      
      // Join authenticated rooms
      this.userSockets.set(userId, client.id);
      client.join(`tenant:${tenantId}`);
      client.join(`user:${userId}`);
      console.log(`[WebSocket] User ${userId} authenticated and connected to tenant ${tenantId}`);
    } catch (error) {
      console.log('[WebSocket] Connection rejected - token verification failed:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.userSockets.delete(userId);
      console.log(`[WebSocket] User ${userId} disconnected`);
    }
  }

  // Send notification to specific user
  emitToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  // Send notification to all users in a tenant
  emitToTenant(tenantId: string, notification: any) {
    this.server.to(`tenant:${tenantId}`).emit('notification', notification);
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}
