import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Super Admin system...\n');

  // Create tenant
  let tenant = await prisma.tenant.findFirst({
    where: { name: 'HVAC Inc.' },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: { name: 'HVAC Inc.' },
    });
    console.log('✅ Created tenant: HVAC Inc.');
  }

  // Define all permissions
  const permissions = [
    // User permissions
    { name: 'users.create', description: 'Create users', resource: 'users', action: 'create', scope: 'all', category: 'User Management' },
    { name: 'users.read', description: 'View users', resource: 'users', action: 'read', scope: 'all', category: 'User Management' },
    { name: 'users.update', description: 'Update users', resource: 'users', action: 'update', scope: 'all', category: 'User Management' },
    { name: 'users.delete', description: 'Delete users', resource: 'users', action: 'delete', scope: 'all', category: 'User Management' },
    { name: 'users.list', description: 'List all users', resource: 'users', action: 'list', scope: 'all', category: 'User Management' },
    { name: 'users.activate', description: 'Activate users', resource: 'users', action: 'activate', scope: 'all', category: 'User Management' },
    { name: 'users.deactivate', description: 'Deactivate users', resource: 'users', action: 'deactivate', scope: 'all', category: 'User Management' },
    { name: 'users.assign_roles', description: 'Assign roles to users', resource: 'users', action: 'assign_roles', scope: 'all', category: 'User Management' },
    
    // Role permissions
    { name: 'roles.create', description: 'Create roles', resource: 'roles', action: 'create', scope: 'all', category: 'Role Management' },
    { name: 'roles.read', description: 'View roles', resource: 'roles', action: 'read', scope: 'all', category: 'Role Management' },
    { name: 'roles.update', description: 'Update roles', resource: 'roles', action: 'update', scope: 'all', category: 'Role Management' },
    { name: 'roles.delete', description: 'Delete roles', resource: 'roles', action: 'delete', scope: 'all', category: 'Role Management' },
    { name: 'roles.list', description: 'List all roles', resource: 'roles', action: 'list', scope: 'all', category: 'Role Management' },
    { name: 'roles.assign_permissions', description: 'Assign permissions to roles', resource: 'roles', action: 'assign_permissions', scope: 'all', category: 'Role Management' },
    
    // Permission permissions
    { name: 'permissions.create', description: 'Create permissions', resource: 'permissions', action: 'create', scope: 'all', category: 'Permission Management' },
    { name: 'permissions.read', description: 'View permissions', resource: 'permissions', action: 'read', scope: 'all', category: 'Permission Management' },
    { name: 'permissions.update', description: 'Update permissions', resource: 'permissions', action: 'update', scope: 'all', category: 'Permission Management' },
    { name: 'permissions.delete', description: 'Delete permissions', resource: 'permissions', action: 'delete', scope: 'all', category: 'Permission Management' },
    { name: 'permissions.list', description: 'List all permissions', resource: 'permissions', action: 'list', scope: 'all', category: 'Permission Management' },
    
    // Tenant permissions
    { name: 'tenants.read', description: 'View tenants', resource: 'tenants', action: 'read', scope: 'all', category: 'Tenant Management' },
    { name: 'tenants.update', description: 'Update tenants', resource: 'tenants', action: 'update', scope: 'all', category: 'Tenant Management' },
    { name: 'tenants.list', description: 'List all tenants', resource: 'tenants', action: 'list', scope: 'all', category: 'Tenant Management' },
    { name: 'tenants.activate', description: 'Activate tenants', resource: 'tenants', action: 'activate', scope: 'all', category: 'Tenant Management' },
    { name: 'tenants.deactivate', description: 'Deactivate tenants', resource: 'tenants', action: 'deactivate', scope: 'all', category: 'Tenant Management' },
    
    // System permissions
    { name: 'system.view_dashboard', description: 'View admin dashboard', resource: 'system', action: 'view_dashboard', scope: 'all', category: 'System' },
    { name: 'system.manage_settings', description: 'Manage system settings', resource: 'system', action: 'manage_settings', scope: 'all', category: 'System' },
    
    // Work Order permissions
    { name: 'work_orders.create', description: 'Create work orders', resource: 'work_orders', action: 'create', scope: 'all', category: 'Work Orders' },
    { name: 'work_orders.read', description: 'View work orders', resource: 'work_orders', action: 'read', scope: 'all', category: 'Work Orders' },
    { name: 'work_orders.update', description: 'Update work orders', resource: 'work_orders', action: 'update', scope: 'all', category: 'Work Orders' },
    { name: 'work_orders.delete', description: 'Delete work orders', resource: 'work_orders', action: 'delete', scope: 'all', category: 'Work Orders' },
    
    // Inventory permissions
    { name: 'inventory.create', description: 'Create inventory items', resource: 'inventory', action: 'create', scope: 'all', category: 'Inventory' },
    { name: 'inventory.read', description: 'View inventory', resource: 'inventory', action: 'read', scope: 'all', category: 'Inventory' },
    { name: 'inventory.update', description: 'Update inventory', resource: 'inventory', action: 'update', scope: 'all', category: 'Inventory' },
    { name: 'inventory.delete', description: 'Delete inventory items', resource: 'inventory', action: 'delete', scope: 'all', category: 'Inventory' },
    
    // CRM permissions
    { name: 'crm.create', description: 'Create CRM records', resource: 'crm', action: 'create', scope: 'all', category: 'CRM' },
    { name: 'crm.read', description: 'View CRM records', resource: 'crm', action: 'read', scope: 'all', category: 'CRM' },
    { name: 'crm.update', description: 'Update CRM records', resource: 'crm', action: 'update', scope: 'all', category: 'CRM' },
    { name: 'crm.delete', description: 'Delete CRM records', resource: 'crm', action: 'delete', scope: 'all', category: 'CRM' },
  ];

  console.log('📋 Creating permissions...');
  const createdPermissions = [];
  for (const perm of permissions) {
    const created = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    createdPermissions.push(created);
  }
  console.log(`✅ Created/verified ${createdPermissions.length} permissions\n`);

  // Create SUPER_ADMIN role
  console.log('👑 Creating SUPER_ADMIN role...');
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      displayName: 'Super Administrator',
      description: 'Full system access with all permissions',
      isSystem: true,
      priority: 100,
      color: '#ef4444', // Red color for super admin
    },
  });
  console.log('✅ SUPER_ADMIN role created\n');

  // Assign ALL permissions to SUPER_ADMIN
  console.log('🔗 Assigning all permissions to SUPER_ADMIN...');
  for (const permission of createdPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log(`✅ Assigned ${createdPermissions.length} permissions to SUPER_ADMIN\n`);

  // Create additional standard roles
  console.log('📝 Creating standard roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      displayName: 'Administrator',
      description: 'Admin access to most features',
      isSystem: true,
      priority: 90,
      color: '#f59e0b',
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: {
      name: 'MANAGER',
      displayName: 'Manager',
      description: 'Manage team and view reports',
      isSystem: true,
      priority: 50,
      color: '#3b82f6',
    },
  });

  const technicianRole = await prisma.role.upsert({
    where: { name: 'TECHNICIAN' },
    update: {},
    create: {
      name: 'TECHNICIAN',
      displayName: 'Technician',
      description: 'Field technician with work order access',
      isSystem: true,
      priority: 30,
      color: '#14b8a6',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      displayName: 'User',
      description: 'Basic user access',
      isSystem: true,
      priority: 10,
      color: '#6b7280',
    },
  });
  console.log('✅ Created standard roles: ADMIN, MANAGER, TECHNICIAN, USER\n');

  // Create super admin user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  console.log('👤 Creating super admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hvac.com' },
    update: {},
    create: {
      email: 'admin@hvac.com',
      password: hashedPassword,
      tenantId: tenant.id,
      firstName: 'Super',
      lastName: 'Admin',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Super admin user created\n');

  // Assign SUPER_ADMIN role to admin user
  console.log('🔐 Assigning SUPER_ADMIN role to admin@hvac.com...');
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: superAdminRole.id,
    },
  });
  console.log('✅ SUPER_ADMIN role assigned\n');

  console.log('═══════════════════════════════════════════════════');
  console.log('🎉 Super Admin Setup Complete!');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log('📧 Email:    admin@hvac.com');
  console.log('🔐 Password: password123');
  console.log('👑 Role:     SUPER_ADMIN');
  console.log('🏢 Tenant:   HVAC Inc.');
  console.log('');
  console.log('⚠️  IMPORTANT: Change the password after first login!');
  console.log('═══════════════════════════════════════════════════');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
