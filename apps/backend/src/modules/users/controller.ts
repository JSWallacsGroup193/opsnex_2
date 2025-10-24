import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  updateProfile(
    @Req() req: any,
    @Body() body: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    }
  ) {
    const userId = req.user.userId;
    return this.usersService.updateProfile(userId, body);
  }

  @Put('password')
  changePassword(
    @Req() req: any,
    @Body() body: {
      currentPassword: string;
      newPassword: string;
    }
  ) {
    const userId = req.user.userId;
    return this.usersService.changePassword(userId, body);
  }
}
