import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotificationService } from './service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Get user's notifications
   */
  @Get()
  async getNotifications(
    @Req() req: any,
    @Query('limit') limit?: string
  ) {
    const userId = req.user.userId;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    
    return this.notificationService.getUserNotifications(userId, limitNum);
  }

  /**
   * Get unread count
   */
  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const userId = req.user.userId;
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  /**
   * Get notifications with count (optimized for polling)
   * Returns both notifications and unread count in a single request
   */
  @Get('with-count')
  async getNotificationsWithCount(
    @Req() req: any,
    @Query('limit') limit?: string
  ) {
    const userId = req.user.userId;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    
    return this.notificationService.getNotificationsWithCount(userId, limitNum);
  }

  /**
   * Mark notification as read
   */
  @Put(':id/read')
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.notificationService.markAsRead(id, userId);
  }

  /**
   * Mark all notifications as read
   */
  @Put('mark-all-read')
  async markAllAsRead(@Req() req: any) {
    const userId = req.user.userId;
    return this.notificationService.markAllAsRead(userId);
  }

  /**
   * Delete notification
   */
  @Delete(':id')
  async deleteNotification(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.notificationService.deleteNotification(id, userId);
  }

  /**
   * Get user notification preferences
   */
  @Get('preferences')
  async getPreferences(@Req() req: any) {
    const userId = req.user.userId;
    return this.notificationService.getUserPreferences(userId);
  }

  /**
   * Update user notification preferences
   */
  @Put('preferences')
  async updatePreferences(@Req() req: any, @Body() data: any) {
    const userId = req.user.userId;
    return this.notificationService.updateUserPreferences(userId, data);
  }

  /**
   * Test endpoint - Create a test notification
   */
  @Post('test')
  async createTestNotification(@Req() req: any, @Body() body: any) {
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;
    
    return this.notificationService.createNotification({
      userId,
      tenantId,
      title: body.title || 'Test Notification',
      message: body.message || 'This is a test notification from OpsNex',
      type: body.type || 'info',
      category: body.category || 'system',
      actionUrl: body.actionUrl,
    });
  }
}
