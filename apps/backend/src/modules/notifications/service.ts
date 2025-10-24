import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { NotificationGateway } from './gateway';
import { EmailNotificationService } from './channels/email.service';
import { SmsNotificationService } from './channels/sms.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly gateway: NotificationGateway,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailNotificationService,
    private readonly smsService: SmsNotificationService,
  ) {}

  /**
   * Create and send a notification
   */
  async createNotification(params: {
    userId: string;
    tenantId: string;
    title: string;
    message: string;
    type?: string;
    category?: string;
    entityType?: string;
    entityId?: string;
    actionUrl?: string;
  }) {
    const {
      userId,
      tenantId,
      title,
      message,
      type = 'info',
      category,
      entityType,
      entityId,
      actionUrl,
    } = params;

    // Create notification in database
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        tenantId,
        title,
        message,
        type,
        category,
        entityType,
        entityId,
        actionUrl,
      },
    });

    // Send via WebSocket if user is online
    this.gateway.emitToUser(userId, notification);

    // Check user preferences for email/SMS
    const prefs = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    // Get user email/phone for sending
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true },
    });

    // Send email if enabled and user has email
    if (prefs?.emailEnabled && this.shouldSendEmail(category, prefs) && user?.email) {
      await this.emailService.sendEmail({
        to: user.email,
        subject: title,
        body: message,
      });
    }

    // Send SMS if enabled and user has phone
    if (prefs?.smsEnabled && this.shouldSendSMS(category, prefs) && user?.phone) {
      await this.smsService.sendSms({
        to: user.phone,
        message: `${title}: ${message}`,
      });
    }

    return notification;
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(userId: string, limit = 50) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Get notifications with unread count (optimized for polling)
   * Returns both notifications and unread count in a single query
   */
  async getNotificationsWithCount(userId: string, limit = 50) {
    const [notifications, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      this.prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      }),
    ]);

    return {
      notifications,
      unreadCount,
      total: notifications.length,
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns this notification
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns this notification
      },
    });
  }

  /**
   * Get or create user notification preferences
   */
  async getUserPreferences(userId: string) {
    let prefs = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await this.prisma.notificationPreference.create({
        data: { userId },
      });
    }

    return prefs;
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(
    userId: string,
    data: {
      emailEnabled?: boolean;
      emailWorkOrders?: boolean;
      emailInvoices?: boolean;
      emailReports?: boolean;
      emailSystemAlerts?: boolean;
      inAppEnabled?: boolean;
      inAppWorkOrders?: boolean;
      inAppInvoices?: boolean;
      inAppReports?: boolean;
      inAppSystemAlerts?: boolean;
      smsEnabled?: boolean;
      smsWorkOrders?: boolean;
      smsInvoices?: boolean;
      smsSystemAlerts?: boolean;
      dailyDigest?: boolean;
      weeklyDigest?: boolean;
      digestTime?: string;
    }
  ) {
    // Get or create preferences first
    await this.getUserPreferences(userId);

    return this.prisma.notificationPreference.update({
      where: { userId },
      data,
    });
  }

  /**
   * Helper: Check if should send email based on category and preferences
   */
  private shouldSendEmail(category: string | null | undefined, prefs: any): boolean {
    if (!prefs?.emailEnabled) return false;
    
    switch (category) {
      case 'work_order':
        return prefs.emailWorkOrders;
      case 'invoice':
        return prefs.emailInvoices;
      case 'report':
        return prefs.emailReports;
      case 'system':
        return prefs.emailSystemAlerts;
      default:
        return false;
    }
  }

  /**
   * Helper: Check if should send SMS based on category and preferences
   */
  private shouldSendSMS(category: string | null | undefined, prefs: any): boolean {
    if (!prefs?.smsEnabled) return false;
    
    switch (category) {
      case 'work_order':
        return prefs.smsWorkOrders;
      case 'invoice':
        return prefs.smsInvoices;
      case 'system':
        return prefs.smsSystemAlerts;
      default:
        return false;
    }
  }
}
