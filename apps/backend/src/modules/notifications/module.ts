import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationController } from './controller';
import { NotificationService } from './service';
import { NotificationGateway } from './gateway';
import { EmailNotificationService } from './channels/email.service';
import { SmsNotificationService } from './channels/sms.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'hvac-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationGateway,
    EmailNotificationService,
    SmsNotificationService,
    PrismaService,
  ],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
