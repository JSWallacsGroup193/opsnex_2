import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { SpaFilter } from './spa.filter';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Serve static files from frontend/dist
  app.use(express.static(join(__dirname, '..', '..', '..', 'frontend', 'dist')));
  
  // NOTE: WebSocket disabled - engine.io has persistent compatibility issues with NestJS HTTP server
  // Real-time notifications use HTTP polling (30-second interval) as production solution
  // Polling endpoint: GET /api/v1/notifications
  // WebSocket can be revisited when engine.io v7+ resolves HTTP server attachment issues
  // app.useWebSocketAdapter(new CustomSocketIoAdapter(app));
  
  // Security headers with Helmet
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProd = nodeEnv === 'production';
  
  app.use(helmet({
    contentSecurityPolicy: isProd ? {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // React needs inline styles
        scriptSrc: ["'self'"], // Strict: no inline or eval in production
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.openai.com'],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    } : false, // Disable CSP in development for easier debugging
  }));
  
  // CORS Configuration - Strict enforcement in production
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];
  
  // Production: REQUIRE ALLOWED_ORIGINS or fail
  // Development: Allow all origins for Replit/local development
  if (isProd && allowedOrigins.length === 0) {
    throw new Error(
      'PRODUCTION SECURITY ERROR: ALLOWED_ORIGINS must be set in production. ' +
      'Set ALLOWED_ORIGINS environment variable with comma-separated list of allowed domains. ' +
      'Example: ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com'
    );
  }
  
  const corsOrigin = isProd ? allowedOrigins : true;
  
  app.enableCors({ 
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  app.setGlobalPrefix('api/v1', {
    exclude: ['/'],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new SpaFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('OpsNex API')
    .setDescription('OpsNex HVAC Operations Management Platform API')
    .setVersion('1.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document, { swaggerOptions: { persistAuthorization: true } });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ OpsNex running on port ${port}`);
  console.log(`✅ Web Application: http://0.0.0.0:${port}/`);
  console.log(`✅ API: http://0.0.0.0:${port}/api/v1`);
  console.log(`✅ Swagger docs: http://0.0.0.0:${port}/api/v1/docs`);
}
bootstrap();
