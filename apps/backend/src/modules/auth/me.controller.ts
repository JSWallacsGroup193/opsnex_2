import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../../common/prisma.service';

@Controller('auth')
export class MeController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        tenantId: true,
        isActive: true,
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                displayName: true,
                color: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return { message: 'Not authenticated' };
    }

    const roles = user.roles.map(ur => ur.role);
    const isSuperAdmin = roles.some(r => r.name === 'SUPER_ADMIN');

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      tenantId: user.tenantId,
      isActive: user.isActive,
      roles,
      isSuperAdmin,
    };
  }
}
