import { ExceptionFilter, Catch, NotFoundException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Catch(NotFoundException)
export class SpaFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Only serve SPA for non-API routes
    if (!request.url.startsWith('/api')) {
      response.sendFile(join(__dirname, '..', '..', '..', 'frontend', 'dist', 'index.html'));
    } else {
      // For API routes, fully preserve the original exception response
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      // Handle both object and string responses
      if (typeof exceptionResponse === 'string') {
        response.status(status).send(exceptionResponse);
      } else {
        response.status(status).json(exceptionResponse);
      }
    }
  }
}
