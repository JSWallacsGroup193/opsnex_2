import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class AdminService {
  // Dashboard
  async getDashboardStats() {
    const [userCount, tenantCount, roleCount, permissionCount, activeUsers] = await Promise.all([
      prisma.user.count(),
      prisma.tenant.count(),
      prisma.role.count(),
      prisma.permission.count(),
      prisma.user.count({ where: { isActive: true } }),
    ]);

    return {
      users: {
        total: userCount,
        active: activeUsers,
        inactive: userCount - activeUsers,
      },
      tenants: tenantCount,
      roles: roleCount,
      permissions: permissionCount,
    };
  }

  // Users
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        tenant: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tenantId: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        tenantId: data.tenantId,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async updateUser(id: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return prisma.user.update({
      where: { id },
      data,
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async activateUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivateUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateUserRoles(userId: string, roleIds: string[]) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await prisma.userRole.deleteMany({
      where: { userId },
    });

    await Promise.all(
      roleIds.map((roleId) =>
        prisma.userRole.create({
          data: {
            userId,
            roleId,
          },
        })
      )
    );

    return this.getUser(userId);
  }

  // Roles
  async getAllRoles() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: { priority: 'desc' },
    });
  }

  async getRole(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async createRole(data: {
    name: string;
    displayName?: string;
    description?: string;
    color?: string;
  }) {
    return prisma.role.create({
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        color: data.color,
        isSystem: false,
      },
    });
  }

  async updateRole(id: string, data: {
    displayName?: string;
    description?: string;
    color?: string;
  }) {
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem) {
      throw new Error('Cannot update system role');
    }

    return prisma.role.update({
      where: { id },
      data,
    });
  }

  async deleteRole(id: string) {
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.isSystem) {
      throw new Error('Cannot delete system role');
    }

    return prisma.role.delete({
      where: { id },
    });
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    await Promise.all(
      permissionIds.map((permissionId) =>
        prisma.rolePermission.create({
          data: {
            roleId,
            permissionId,
          },
        })
      )
    );

    return this.getRole(roleId);
  }

  // Permissions
  async getAllPermissions() {
    return prisma.permission.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async createPermission(data: {
    name: string;
    description?: string;
    resource?: string;
    action?: string;
    scope?: string;
    category?: string;
  }) {
    return prisma.permission.create({
      data,
    });
  }

  async updatePermission(id: string, data: {
    description?: string;
    category?: string;
  }) {
    const permission = await prisma.permission.findUnique({ where: { id } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return prisma.permission.update({
      where: { id },
      data,
    });
  }

  async deletePermission(id: string) {
    const permission = await prisma.permission.findUnique({ where: { id } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return prisma.permission.delete({
      where: { id },
    });
  }

  // Tenants
  async getAllTenants() {
    return prisma.tenant.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTenant(id: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isActive: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async updateTenant(id: string, data: {
    name?: string;
    plan?: string;
    settings?: any;
  }) {
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async activateTenant(id: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return prisma.tenant.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivateTenant(id: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return prisma.tenant.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
