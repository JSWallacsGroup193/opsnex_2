import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtAttachMiddleware implements NestMiddleware {
  constructor(private readonly jwt: JwtService) {}
  use(req: Request, _res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];
    if (auth?.startsWith('Bearer ')) {
      const token = auth.slice('Bearer '.length);
      try {
        const payload = this.jwt.verify(token);
        (req as any).user = { userId: payload.sub, tenantId: payload.tenantId };
      } catch {}
    }
    next();
  }
}
