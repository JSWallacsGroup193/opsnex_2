import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { AdminService } from './service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // Users
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Post('users')
  createUser(@Body() body: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tenantId: string;
  }) {
    return this.adminService.createUser(body);
  }

  @Put('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
    }
  ) {
    return this.adminService.updateUser(id, body);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Post('users/:id/activate')
  activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
  }

  @Post('users/:id/deactivate')
  deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  @Put('users/:id/roles')
  updateUserRoles(
    @Param('id') id: string,
    @Body() body: { roleIds: string[] }
  ) {
    return this.adminService.updateUserRoles(id, body.roleIds);
  }

  // Roles
  @Get('roles')
  getAllRoles() {
    return this.adminService.getAllRoles();
  }

  @Get('roles/:id')
  getRole(@Param('id') id: string) {
    return this.adminService.getRole(id);
  }

  @Post('roles')
  createRole(@Body() body: {
    name: string;
    displayName?: string;
    description?: string;
    color?: string;
  }) {
    return this.adminService.createRole(body);
  }

  @Put('roles/:id')
  updateRole(
    @Param('id') id: string,
    @Body() body: {
      displayName?: string;
      description?: string;
      color?: string;
    }
  ) {
    return this.adminService.updateRole(id, body);
  }

  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.adminService.deleteRole(id);
  }

  @Put('roles/:id/permissions')
  updateRolePermissions(
    @Param('id') id: string,
    @Body() body: { permissionIds: string[] }
  ) {
    return this.adminService.updateRolePermissions(id, body.permissionIds);
  }

  // Permissions
  @Get('permissions')
  getAllPermissions() {
    return this.adminService.getAllPermissions();
  }

  @Post('permissions')
  createPermission(@Body() body: {
    name: string;
    description?: string;
    resource?: string;
    action?: string;
    scope?: string;
    category?: string;
  }) {
    return this.adminService.createPermission(body);
  }

  @Put('permissions/:id')
  updatePermission(
    @Param('id') id: string,
    @Body() body: {
      description?: string;
      category?: string;
    }
  ) {
    return this.adminService.updatePermission(id, body);
  }

  @Delete('permissions/:id')
  deletePermission(@Param('id') id: string) {
    return this.adminService.deletePermission(id);
  }

  // Tenants
  @Get('tenants')
  getAllTenants() {
    return this.adminService.getAllTenants();
  }

  @Get('tenants/:id')
  getTenant(@Param('id') id: string) {
    return this.adminService.getTenant(id);
  }

  @Put('tenants/:id')
  updateTenant(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      plan?: string;
      settings?: any;
    }
  ) {
    return this.adminService.updateTenant(id, body);
  }

  @Post('tenants/:id/activate')
  activateTenant(@Param('id') id: string) {
    return this.adminService.activateTenant(id);
  }

  @Post('tenants/:id/deactivate')
  deactivateTenant(@Param('id') id: string) {
    return this.adminService.deactivateTenant(id);
  }
}
