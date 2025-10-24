import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { INestApplicationContext } from '@nestjs/common';
import * as http from 'http';

export class CustomSocketIoAdapter extends IoAdapter {
  constructor(app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    // Apply polyfill to the server that will be created
    const originalListeners = http.Server.prototype.listeners;
    http.Server.prototype.listeners = function(event: string | symbol) {
      // Use rawListeners if listeners doesn't exist or fails
      if (originalListeners && typeof originalListeners === 'function') {
        try {
          return originalListeners.call(this, event);
        } catch (e) {
          return this.rawListeners(event);
        }
      }
      return this.rawListeners(event);
    };

    // Create Socket.IO server with CORS enabled
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        credentials: true,
      },
      path: '/notifications/socket.io',
    });
    
    return server;
  }
}
