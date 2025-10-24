
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';

import { AuthModule } from './modules/auth/module';
import { AdminModule } from './modules/admin/module';
import { UsersModule } from './modules/users/module';
import { WorkOrderModule } from './modules/workorder/module';
import { BarcodeModule } from './modules/barcode/module';
import { CrmModule } from './modules/crm/module';
import { DispatchModule } from './modules/dispatch/module';
import { InventoryModule } from './modules/inventory/module';
import { PurchasingModule } from './modules/purchasing/module';
import { ForecastModule } from './modules/forecast/module';
import { LabelModule } from './modules/labels/label.module';
import { ChatModule } from './modules/chat/module';
import { ScannerModule } from './modules/scanner/module';
import { FieldCalculationModule } from './modules/field-calculation/module';
import { NotificationModule } from './modules/notifications/module';
import { EstimatorModule } from './modules/estimator/estimator.module';
import { QueueModule } from './queue/queue.module';
import { ServiceCatalogModule } from './modules/service-catalog/service-catalog.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { EnhancedCrmModule } from './modules/enhanced-crm/enhanced-crm.module';
import { PrismaService } from './common/prisma.service';
import { ConfigValidationService } from './common/config-validation.service';
import { JwtAttachMiddleware } from './middleware/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { ttl: 60_000, limit: 120 },
    ]),
    JwtModule.register({ 
      secret: process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET is required') })(), 
      signOptions: { expiresIn: '1h' } 
    }),
    AuthModule,
    AdminModule,
    UsersModule,
    WorkOrderModule,
    BarcodeModule,
    CrmModule,
    DispatchModule,
    InventoryModule,
    PurchasingModule,
    ForecastModule,
    LabelModule,
    ChatModule,
    ScannerModule,
    FieldCalculationModule,
    NotificationModule,
    EstimatorModule,
    QueueModule,
    ServiceCatalogModule,
    FeedbackModule,
    VendorModule,
    EnhancedCrmModule,
  ],
  controllers: [AppController, HealthController, MetricsController],
  providers: [AppService, PrismaService, ConfigValidationService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAttachMiddleware).forRoutes('*');
  }
}
