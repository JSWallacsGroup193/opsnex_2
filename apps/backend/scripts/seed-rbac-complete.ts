import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Complete RBAC System...\n');

  // Step 1: Update existing MANAGER role to FIELD_MANAGER
  console.log('📝 Updating MANAGER role to FIELD_MANAGER...');
  try {
    const managerRole = await prisma.role.findUnique({
      where: { name: 'MANAGER' },
    });

    if (managerRole) {
      await prisma.role.update({
        where: { name: 'MANAGER' },
        data: {
          name: 'FIELD_MANAGER',
          displayName: 'Field Manager',
          description: 'Manages field operations and technicians',
          priority: 70,
          color: '#3b82f6',
        },
      });
      console.log('✅ Updated MANAGER → FIELD_MANAGER\n');
    }
  } catch (error) {
    console.log('ℹ️  MANAGER role not found, will create FIELD_MANAGER\n');
  }

  // Step 2: Define all 13 roles
  console.log('👥 Creating/updating all roles...');
  const roleDefinitions = [
    { name: 'SUPER_ADMIN', displayName: 'Super Administrator', description: 'Full system access with all permissions', isSystem: true, priority: 100, color: '#ef4444' },
    { name: 'OWNER', displayName: 'Owner/CEO', description: 'Business owner with full operational access', isSystem: true, priority: 95, color: '#9333ea' },
    { name: 'ADMIN', displayName: 'Administrator', description: 'Tenant administrator with broad access', isSystem: true, priority: 90, color: '#f59e0b' },
    { name: 'FIELD_MANAGER', displayName: 'Field Manager', description: 'Manages field operations and technicians', isSystem: true, priority: 70, color: '#3b82f6' },
    { name: 'FIELD_SUPERVISOR', displayName: 'Field Supervisor', description: 'Supervises field technicians', isSystem: true, priority: 60, color: '#06b6d4' },
    { name: 'OFFICE_MANAGER', displayName: 'Office Manager', description: 'Manages office operations and purchasing', isSystem: true, priority: 65, color: '#8b5cf6' },
    { name: 'WAREHOUSE_MANAGER', displayName: 'Warehouse Manager', description: 'Manages inventory and warehouses', isSystem: true, priority: 55, color: '#10b981' },
    { name: 'TECHNICIAN', displayName: 'Technician', description: 'Field technician with work order access', isSystem: true, priority: 50, color: '#14b8a6' },
    { name: 'SALES_REPRESENTATIVE', displayName: 'Sales Representative', description: 'Manages sales and customer leads', isSystem: true, priority: 45, color: '#f97316' },
    { name: 'CUSTOMER_SERVICE_REPRESENTATIVE', displayName: 'Customer Service Rep', description: 'Handles customer inquiries and scheduling', isSystem: true, priority: 40, color: '#ec4899' },
    { name: 'ACCOUNTANT', displayName: 'Accountant', description: 'Manages financials and billing', isSystem: true, priority: 50, color: '#84cc16' },
    { name: 'VIEWER', displayName: 'Viewer', description: 'Read-only access for stakeholders', isSystem: true, priority: 20, color: '#64748b' },
    { name: 'USER', displayName: 'User', description: 'Basic user access', isSystem: true, priority: 10, color: '#6b7280' },
  ];

  const createdRoles = {};
  for (const roleDef of roleDefinitions) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: {
        displayName: roleDef.displayName,
        description: roleDef.description,
        priority: roleDef.priority,
        color: roleDef.color,
      },
      create: roleDef,
    });
    createdRoles[roleDef.name] = role;
  }
  console.log(`✅ Created/updated ${roleDefinitions.length} roles\n`);

  // Step 3: Define comprehensive permissions for all 17 modules
  console.log('📋 Creating comprehensive permissions...');
  const permissionDefinitions = [
    // Work Orders (9 permissions)
    { name: 'work_orders.create', description: 'Create work orders', resource: 'work_orders', action: 'create', scope: 'all', category: 'Work Orders' },
    { name: 'work_orders.read', description: 'View all work orders', resource: 'work_orders', action: 'read', scope: 'all', category: 'Work Orders' },
    { name: 'work_orders.read_own', description: 'View own work orders', resource: 'work_orders', action: 'read', scope: 'own', category: 'Work Orders' },
    { name: 'work_orders.update', description: 'Update all work orders', resource: 'work_orders', action: 'update', scope: 'all', category: 'Work Orders' },
    { name: 'work_orders.update_own', description: 'Update own work orders', resource: 'work_orders', action: 'update', scope: 'own', category: 'Work Orders' },
    { name: 'work_orders.delete', description: 'Delete work orders', resource: 'work_orders', action: 'delete', scope: 'all', category: 'Work Orders' },
    { name: 'work_orders.assign', description: 'Assign work orders to technicians', resource: 'work_orders', action: 'assign', scope: 'all', category: 'Work Orders' },
    { name: 'work_orders.complete', description: 'Mark work orders as complete', resource: 'work_orders', action: 'complete', scope: 'all', category: 'Work Orders' },
    { name: 'work_orders.cancel', description: 'Cancel work orders', resource: 'work_orders', action: 'cancel', scope: 'all', category: 'Work Orders' },

    // CRM - Accounts (6 permissions)
    { name: 'crm.accounts.create', description: 'Create customer accounts', resource: 'crm_accounts', action: 'create', scope: 'all', category: 'CRM' },
    { name: 'crm.accounts.read', description: 'View all customer accounts', resource: 'crm_accounts', action: 'read', scope: 'all', category: 'CRM' },
    { name: 'crm.accounts.read_own', description: 'View own customer accounts', resource: 'crm_accounts', action: 'read', scope: 'own', category: 'CRM' },
    { name: 'crm.accounts.update', description: 'Update all customer accounts', resource: 'crm_accounts', action: 'update', scope: 'all', category: 'CRM' },
    { name: 'crm.accounts.update_own', description: 'Update own customer accounts', resource: 'crm_accounts', action: 'update', scope: 'own', category: 'CRM' },
    { name: 'crm.accounts.delete', description: 'Delete customer accounts', resource: 'crm_accounts', action: 'delete', scope: 'all', category: 'CRM' },

    // CRM - Contacts (6 permissions)
    { name: 'crm.contacts.create', description: 'Create contacts', resource: 'crm_contacts', action: 'create', scope: 'all', category: 'CRM' },
    { name: 'crm.contacts.read', description: 'View all contacts', resource: 'crm_contacts', action: 'read', scope: 'all', category: 'CRM' },
    { name: 'crm.contacts.read_own', description: 'View own contacts', resource: 'crm_contacts', action: 'read', scope: 'own', category: 'CRM' },
    { name: 'crm.contacts.update', description: 'Update all contacts', resource: 'crm_contacts', action: 'update', scope: 'all', category: 'CRM' },
    { name: 'crm.contacts.update_own', description: 'Update own contacts', resource: 'crm_contacts', action: 'update', scope: 'own', category: 'CRM' },
    { name: 'crm.contacts.delete', description: 'Delete contacts', resource: 'crm_contacts', action: 'delete', scope: 'all', category: 'CRM' },

    // CRM - Leads (6 permissions)
    { name: 'crm.leads.create', description: 'Create leads', resource: 'crm_leads', action: 'create', scope: 'all', category: 'CRM' },
    { name: 'crm.leads.read', description: 'View all leads', resource: 'crm_leads', action: 'read', scope: 'all', category: 'CRM' },
    { name: 'crm.leads.read_own', description: 'View own leads', resource: 'crm_leads', action: 'read', scope: 'own', category: 'CRM' },
    { name: 'crm.leads.update', description: 'Update all leads', resource: 'crm_leads', action: 'update', scope: 'all', category: 'CRM' },
    { name: 'crm.leads.update_own', description: 'Update own leads', resource: 'crm_leads', action: 'update', scope: 'own', category: 'CRM' },
    { name: 'crm.leads.delete', description: 'Delete leads', resource: 'crm_leads', action: 'delete', scope: 'all', category: 'CRM' },

    // CRM - Notes (6 permissions)
    { name: 'crm.notes.create', description: 'Create notes', resource: 'crm_notes', action: 'create', scope: 'all', category: 'CRM' },
    { name: 'crm.notes.read', description: 'View all notes', resource: 'crm_notes', action: 'read', scope: 'all', category: 'CRM' },
    { name: 'crm.notes.read_own', description: 'View own notes', resource: 'crm_notes', action: 'read', scope: 'own', category: 'CRM' },
    { name: 'crm.notes.update', description: 'Update all notes', resource: 'crm_notes', action: 'update', scope: 'all', category: 'CRM' },
    { name: 'crm.notes.update_own', description: 'Update own notes', resource: 'crm_notes', action: 'update', scope: 'own', category: 'CRM' },
    { name: 'crm.notes.delete', description: 'Delete notes', resource: 'crm_notes', action: 'delete', scope: 'all', category: 'CRM' },

    // Inventory - SKUs (4 permissions)
    { name: 'inventory.skus.create', description: 'Create SKUs', resource: 'inventory_skus', action: 'create', scope: 'all', category: 'Inventory' },
    { name: 'inventory.skus.read', description: 'View SKUs', resource: 'inventory_skus', action: 'read', scope: 'all', category: 'Inventory' },
    { name: 'inventory.skus.update', description: 'Update SKUs', resource: 'inventory_skus', action: 'update', scope: 'all', category: 'Inventory' },
    { name: 'inventory.skus.delete', description: 'Delete SKUs', resource: 'inventory_skus', action: 'delete', scope: 'all', category: 'Inventory' },

    // Inventory - Warehouses (4 permissions)
    { name: 'inventory.warehouses.create', description: 'Create warehouses', resource: 'inventory_warehouses', action: 'create', scope: 'all', category: 'Inventory' },
    { name: 'inventory.warehouses.read', description: 'View warehouses', resource: 'inventory_warehouses', action: 'read', scope: 'all', category: 'Inventory' },
    { name: 'inventory.warehouses.update', description: 'Update warehouses', resource: 'inventory_warehouses', action: 'update', scope: 'all', category: 'Inventory' },
    { name: 'inventory.warehouses.delete', description: 'Delete warehouses', resource: 'inventory_warehouses', action: 'delete', scope: 'all', category: 'Inventory' },

    // Inventory - Bins (4 permissions)
    { name: 'inventory.bins.create', description: 'Create bins', resource: 'inventory_bins', action: 'create', scope: 'all', category: 'Inventory' },
    { name: 'inventory.bins.read', description: 'View bins', resource: 'inventory_bins', action: 'read', scope: 'all', category: 'Inventory' },
    { name: 'inventory.bins.update', description: 'Update bins', resource: 'inventory_bins', action: 'update', scope: 'all', category: 'Inventory' },
    { name: 'inventory.bins.delete', description: 'Delete bins', resource: 'inventory_bins', action: 'delete', scope: 'all', category: 'Inventory' },

    // Inventory - Stock Ledger (3 permissions)
    { name: 'inventory.stock_ledger.create', description: 'Create stock transactions', resource: 'inventory_stock', action: 'create', scope: 'all', category: 'Inventory' },
    { name: 'inventory.stock_ledger.read', description: 'View stock ledger', resource: 'inventory_stock', action: 'read', scope: 'all', category: 'Inventory' },
    { name: 'inventory.stock_ledger.adjust', description: 'Adjust stock levels', resource: 'inventory_stock', action: 'adjust', scope: 'all', category: 'Inventory' },

    // Purchasing (7 permissions)
    { name: 'purchasing.create', description: 'Create purchase orders', resource: 'purchasing', action: 'create', scope: 'all', category: 'Purchasing' },
    { name: 'purchasing.read', description: 'View purchase orders', resource: 'purchasing', action: 'read', scope: 'all', category: 'Purchasing' },
    { name: 'purchasing.read_own', description: 'View own purchase orders', resource: 'purchasing', action: 'read', scope: 'own', category: 'Purchasing' },
    { name: 'purchasing.update', description: 'Update purchase orders', resource: 'purchasing', action: 'update', scope: 'all', category: 'Purchasing' },
    { name: 'purchasing.delete', description: 'Delete purchase orders', resource: 'purchasing', action: 'delete', scope: 'all', category: 'Purchasing' },
    { name: 'purchasing.approve', description: 'Approve purchase orders', resource: 'purchasing', action: 'approve', scope: 'all', category: 'Purchasing' },
    { name: 'purchasing.receive', description: 'Receive purchase orders', resource: 'purchasing', action: 'receive', scope: 'all', category: 'Purchasing' },

    // Dispatch (7 permissions)
    { name: 'dispatch.create', description: 'Create dispatch assignments', resource: 'dispatch', action: 'create', scope: 'all', category: 'Dispatch' },
    { name: 'dispatch.read', description: 'View all dispatch schedules', resource: 'dispatch', action: 'read', scope: 'all', category: 'Dispatch' },
    { name: 'dispatch.read_team', description: 'View team dispatch schedules', resource: 'dispatch', action: 'read', scope: 'team', category: 'Dispatch' },
    { name: 'dispatch.update', description: 'Update dispatch assignments', resource: 'dispatch', action: 'update', scope: 'all', category: 'Dispatch' },
    { name: 'dispatch.delete', description: 'Delete dispatch assignments', resource: 'dispatch', action: 'delete', scope: 'all', category: 'Dispatch' },
    { name: 'dispatch.assign', description: 'Assign work to technicians', resource: 'dispatch', action: 'assign', scope: 'all', category: 'Dispatch' },
    { name: 'dispatch.view_all', description: 'View entire dispatch board', resource: 'dispatch', action: 'view_all', scope: 'all', category: 'Dispatch' },

    // Forecasting (4 permissions)
    { name: 'forecasting.create', description: 'Create forecasts', resource: 'forecasting', action: 'create', scope: 'all', category: 'Forecasting' },
    { name: 'forecasting.read', description: 'View forecasts', resource: 'forecasting', action: 'read', scope: 'all', category: 'Forecasting' },
    { name: 'forecasting.generate', description: 'Generate demand forecasts', resource: 'forecasting', action: 'generate', scope: 'all', category: 'Forecasting' },
    { name: 'forecasting.view_recommendations', description: 'View reorder recommendations', resource: 'forecasting', action: 'view_recommendations', scope: 'all', category: 'Forecasting' },

    // Field Tools (4 permissions)
    { name: 'field_tools.use', description: 'Use field calculators', resource: 'field_tools', action: 'use', scope: 'all', category: 'Field Tools' },
    { name: 'field_tools.save_calculations', description: 'Save calculations', resource: 'field_tools', action: 'save', scope: 'all', category: 'Field Tools' },
    { name: 'field_tools.view_history', description: 'View calculation history', resource: 'field_tools', action: 'view_history', scope: 'all', category: 'Field Tools' },
    { name: 'field_tools.use_ai_estimator', description: 'Use AI cost estimator', resource: 'field_tools', action: 'use_ai', scope: 'all', category: 'Field Tools' },

    // Barcode Scanner (2 permissions)
    { name: 'barcode.scan', description: 'Scan barcodes', resource: 'barcode', action: 'scan', scope: 'all', category: 'Barcode Scanner' },
    { name: 'barcode.lookup', description: 'Lookup scanned items', resource: 'barcode', action: 'lookup', scope: 'all', category: 'Barcode Scanner' },

    // Labels (3 permissions)
    { name: 'labels.generate', description: 'Generate labels', resource: 'labels', action: 'generate', scope: 'all', category: 'Labels' },
    { name: 'labels.print', description: 'Print labels', resource: 'labels', action: 'print', scope: 'all', category: 'Labels' },
    { name: 'labels.export', description: 'Export labels to PDF', resource: 'labels', action: 'export', scope: 'all', category: 'Labels' },

    // User Management (8 permissions - keep existing)
    { name: 'users.create', description: 'Create users', resource: 'users', action: 'create', scope: 'all', category: 'User Management' },
    { name: 'users.read', description: 'View users', resource: 'users', action: 'read', scope: 'all', category: 'User Management' },
    { name: 'users.update', description: 'Update users', resource: 'users', action: 'update', scope: 'all', category: 'User Management' },
    { name: 'users.delete', description: 'Delete users', resource: 'users', action: 'delete', scope: 'all', category: 'User Management' },
    { name: 'users.activate', description: 'Activate users', resource: 'users', action: 'activate', scope: 'all', category: 'User Management' },
    { name: 'users.deactivate', description: 'Deactivate users', resource: 'users', action: 'deactivate', scope: 'all', category: 'User Management' },
    { name: 'users.assign_roles', description: 'Assign roles to users', resource: 'users', action: 'assign_roles', scope: 'all', category: 'User Management' },
    { name: 'users.list', description: 'List all users', resource: 'users', action: 'list', scope: 'all', category: 'User Management' },

    // Role Management (6 permissions - keep existing)
    { name: 'roles.create', description: 'Create roles', resource: 'roles', action: 'create', scope: 'all', category: 'Role Management' },
    { name: 'roles.read', description: 'View roles', resource: 'roles', action: 'read', scope: 'all', category: 'Role Management' },
    { name: 'roles.update', description: 'Update roles', resource: 'roles', action: 'update', scope: 'all', category: 'Role Management' },
    { name: 'roles.delete', description: 'Delete roles', resource: 'roles', action: 'delete', scope: 'all', category: 'Role Management' },
    { name: 'roles.list', description: 'List all roles', resource: 'roles', action: 'list', scope: 'all', category: 'Role Management' },
    { name: 'roles.assign_permissions', description: 'Assign permissions to roles', resource: 'roles', action: 'assign_permissions', scope: 'all', category: 'Role Management' },

    // Permission Management (5 permissions - keep existing)
    { name: 'permissions.create', description: 'Create permissions', resource: 'permissions', action: 'create', scope: 'all', category: 'Permission Management' },
    { name: 'permissions.read', description: 'View permissions', resource: 'permissions', action: 'read', scope: 'all', category: 'Permission Management' },
    { name: 'permissions.update', description: 'Update permissions', resource: 'permissions', action: 'update', scope: 'all', category: 'Permission Management' },
    { name: 'permissions.delete', description: 'Delete permissions', resource: 'permissions', action: 'delete', scope: 'all', category: 'Permission Management' },
    { name: 'permissions.list', description: 'List all permissions', resource: 'permissions', action: 'list', scope: 'all', category: 'Permission Management' },

    // Tenant Management (5 permissions - keep existing)
    { name: 'tenants.read', description: 'View tenants', resource: 'tenants', action: 'read', scope: 'all', category: 'Tenant Management' },
    { name: 'tenants.update', description: 'Update tenants', resource: 'tenants', action: 'update', scope: 'all', category: 'Tenant Management' },
    { name: 'tenants.list', description: 'List all tenants', resource: 'tenants', action: 'list', scope: 'all', category: 'Tenant Management' },
    { name: 'tenants.activate', description: 'Activate tenants', resource: 'tenants', action: 'activate', scope: 'all', category: 'Tenant Management' },
    { name: 'tenants.deactivate', description: 'Deactivate tenants', resource: 'tenants', action: 'deactivate', scope: 'all', category: 'Tenant Management' },

    // System Settings (3 permissions)
    { name: 'system.view_dashboard', description: 'View admin dashboard', resource: 'system', action: 'view_dashboard', scope: 'all', category: 'System' },
    { name: 'system.manage_settings', description: 'Manage system settings', resource: 'system', action: 'manage_settings', scope: 'all', category: 'System' },
    { name: 'system.view_metrics', description: 'View system metrics', resource: 'system', action: 'view_metrics', scope: 'all', category: 'System' },

    // Notifications (6 permissions)
    { name: 'notifications.read', description: 'View all notifications', resource: 'notifications', action: 'read', scope: 'all', category: 'Notifications' },
    { name: 'notifications.read_own', description: 'View own notifications', resource: 'notifications', action: 'read', scope: 'own', category: 'Notifications' },
    { name: 'notifications.create', description: 'Create notifications', resource: 'notifications', action: 'create', scope: 'all', category: 'Notifications' },
    { name: 'notifications.update_preferences', description: 'Update notification preferences', resource: 'notifications', action: 'update_preferences', scope: 'all', category: 'Notifications' },
    { name: 'notifications.delete', description: 'Delete notifications', resource: 'notifications', action: 'delete', scope: 'all', category: 'Notifications' },
    { name: 'notifications.send', description: 'Send notifications', resource: 'notifications', action: 'send', scope: 'all', category: 'Notifications' },

    // AI Chat (2 permissions)
    { name: 'ai_chat.use', description: 'Use AI chat assistant', resource: 'ai_chat', action: 'use', scope: 'all', category: 'AI Chat' },
    { name: 'ai_chat.view_history', description: 'View chat history', resource: 'ai_chat', action: 'view_history', scope: 'all', category: 'AI Chat' },

    // Reports (4 permissions)
    { name: 'reports.view_all', description: 'View all reports', resource: 'reports', action: 'view_all', scope: 'all', category: 'Reports' },
    { name: 'reports.view_own', description: 'View own reports', resource: 'reports', action: 'view_own', scope: 'own', category: 'Reports' },
    { name: 'reports.generate', description: 'Generate reports', resource: 'reports', action: 'generate', scope: 'all', category: 'Reports' },
    { name: 'reports.export', description: 'Export reports', resource: 'reports', action: 'export', scope: 'all', category: 'Reports' },
  ];

  const createdPermissions = {};
  for (const permDef of permissionDefinitions) {
    const perm = await prisma.permission.upsert({
      where: { name: permDef.name },
      update: {
        description: permDef.description,
        resource: permDef.resource,
        action: permDef.action,
        scope: permDef.scope,
        category: permDef.category,
      },
      create: permDef,
    });
    createdPermissions[permDef.name] = perm;
  }
  console.log(`✅ Created/updated ${permissionDefinitions.length} permissions\n`);

  // Step 4: Assign permissions to roles based on the permission matrix
  console.log('🔗 Assigning permissions to roles...');

  // Helper function to assign permissions
  async function assignPermissionsToRole(roleName: string, permissionNames: string[]) {
    const role = createdRoles[roleName];
    if (!role) {
      console.log(`⚠️  Role ${roleName} not found, skipping...`);
      return;
    }

    let assignedCount = 0;
    for (const permName of permissionNames) {
      const perm = createdPermissions[permName];
      if (!perm) {
        console.log(`⚠️  Permission ${permName} not found, skipping...`);
        continue;
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: perm.id,
        },
      });
      assignedCount++;
    }
    console.log(`  ✓ ${roleName}: ${assignedCount} permissions`);
  }

  // Helper function to get all permission names
  const getAllPermissions = () => Object.keys(createdPermissions);

  // Get permission subsets by access level
  const getFullAccessPermissions = (module: string) => {
    return Object.keys(createdPermissions).filter(name => 
      name.startsWith(module) && 
      !name.includes('read_own') && 
      !name.includes('update_own') &&
      !name.includes('read_team')
    );
  };

  const getViewPermissions = (module: string) => {
    return Object.keys(createdPermissions).filter(name => 
      name.startsWith(module) && name.includes('.read')
    );
  };

  const getEditPermissions = (module: string) => {
    return Object.keys(createdPermissions).filter(name => 
      (name.startsWith(module) && (name.includes('.read') || name.includes('.update')))
    );
  };

  const getLimitedPermissions = (module: string) => {
    return Object.keys(createdPermissions).filter(name => 
      name.startsWith(module) && (name.includes('_own') || name.includes('read'))
    );
  };

  // SUPER_ADMIN - Gets ALL permissions
  await assignPermissionsToRole('SUPER_ADMIN', getAllPermissions());

  // OWNER - Full operational access (no user/role/permission/tenant management)
  const ownerPerms = [
    ...getFullAccessPermissions('work_orders'),
    ...getFullAccessPermissions('crm'),
    ...getFullAccessPermissions('inventory'),
    ...getFullAccessPermissions('purchasing'),
    ...getFullAccessPermissions('dispatch'),
    ...getFullAccessPermissions('forecasting'),
    ...getFullAccessPermissions('field_tools'),
    ...getFullAccessPermissions('barcode'),
    ...getFullAccessPermissions('labels'),
    'system.view_dashboard', 'system.view_metrics',
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
    ...getFullAccessPermissions('reports'),
  ];
  await assignPermissionsToRole('OWNER', ownerPerms);

  // ADMIN - Full access except tenant management
  const adminPerms = [
    ...getFullAccessPermissions('work_orders'),
    ...getFullAccessPermissions('crm'),
    ...getFullAccessPermissions('inventory'),
    ...getFullAccessPermissions('purchasing'),
    ...getFullAccessPermissions('dispatch'),
    ...getFullAccessPermissions('forecasting'),
    ...getFullAccessPermissions('field_tools'),
    ...getFullAccessPermissions('barcode'),
    ...getFullAccessPermissions('labels'),
    ...getFullAccessPermissions('users'),
    ...getFullAccessPermissions('roles'),
    ...getFullAccessPermissions('permissions'),
    ...getFullAccessPermissions('system'),
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
    ...getFullAccessPermissions('reports'),
  ];
  await assignPermissionsToRole('ADMIN', adminPerms);

  // FIELD_MANAGER - Work Orders: full, CRM: edit, Inventory: view, Purchasing: edit, Dispatch: full
  const fieldManagerPerms = [
    ...getFullAccessPermissions('work_orders'),
    ...getEditPermissions('crm'),
    ...getViewPermissions('inventory'),
    ...getEditPermissions('purchasing'),
    ...getFullAccessPermissions('dispatch'),
    ...getViewPermissions('forecasting'),
    ...getFullAccessPermissions('field_tools'),
    'barcode.scan', 'barcode.lookup',
    'labels.generate', 'labels.print',
    'system.view_dashboard', 'system.view_metrics',
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
    'reports.view_own', 'reports.generate',
  ];
  await assignPermissionsToRole('FIELD_MANAGER', fieldManagerPerms);

  // FIELD_SUPERVISOR - Work Orders: edit, CRM: view, Inventory: view, Dispatch: edit
  const fieldSupervisorPerms = [
    ...getEditPermissions('work_orders'),
    'work_orders.assign', 'work_orders.complete',
    ...getViewPermissions('crm'),
    ...getViewPermissions('inventory'),
    ...getEditPermissions('dispatch'),
    ...getFullAccessPermissions('field_tools'),
    'barcode.scan', 'barcode.lookup',
    'labels.generate', 'labels.print',
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
    'reports.view_own',
  ];
  await assignPermissionsToRole('FIELD_SUPERVISOR', fieldSupervisorPerms);

  // TECHNICIAN - Work Orders: edit (own), Field Tools: full, Scanner: full
  const technicianPerms = [
    'work_orders.read', 'work_orders.read_own', 'work_orders.update_own', 'work_orders.complete',
    ...getLimitedPermissions('crm'),
    ...getViewPermissions('inventory'),
    ...getFullAccessPermissions('field_tools'),
    ...getFullAccessPermissions('barcode'),
    'labels.generate',
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
  ];
  await assignPermissionsToRole('TECHNICIAN', technicianPerms);

  // OFFICE_MANAGER - Purchasing: full, CRM: edit, Labels: full, Settings: edit
  const officeManagerPerms = [
    ...getViewPermissions('work_orders'),
    ...getEditPermissions('crm'),
    ...getViewPermissions('inventory'),
    ...getFullAccessPermissions('purchasing'),
    ...getViewPermissions('dispatch'),
    ...getViewPermissions('forecasting'),
    'field_tools.use', 'field_tools.view_history',
    'barcode.scan', 'barcode.lookup',
    ...getFullAccessPermissions('labels'),
    'system.view_dashboard', 'system.manage_settings', 'system.view_metrics',
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
    ...getFullAccessPermissions('reports'),
  ];
  await assignPermissionsToRole('OFFICE_MANAGER', officeManagerPerms);

  // WAREHOUSE_MANAGER - Inventory: full, Forecasting: full, Scanner: full, Labels: full
  const warehouseManagerPerms = [
    ...getViewPermissions('work_orders'),
    ...getFullAccessPermissions('inventory'),
    'purchasing.read', 'purchasing.receive',
    ...getFullAccessPermissions('forecasting'),
    'field_tools.use', 'field_tools.view_history',
    ...getFullAccessPermissions('barcode'),
    ...getFullAccessPermissions('labels'),
    'system.view_dashboard', 'system.view_metrics',
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
    ...getFullAccessPermissions('reports'),
  ];
  await assignPermissionsToRole('WAREHOUSE_MANAGER', warehouseManagerPerms);

  // SALES_REPRESENTATIVE - CRM: full, Work Orders: view, Dispatch: view
  const salesRepPerms = [
    ...getViewPermissions('work_orders'),
    ...getFullAccessPermissions('crm'),
    ...getViewPermissions('inventory'),
    ...getViewPermissions('dispatch'),
    'field_tools.use', 'field_tools.use_ai_estimator',
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
    'reports.view_own', 'reports.generate',
  ];
  await assignPermissionsToRole('SALES_REPRESENTATIVE', salesRepPerms);

  // CUSTOMER_SERVICE_REPRESENTATIVE - Work Orders: edit, CRM: full, Dispatch: edit
  const csrPerms = [
    ...getEditPermissions('work_orders'),
    'work_orders.create', 'work_orders.assign',
    ...getFullAccessPermissions('crm'),
    ...getViewPermissions('inventory'),
    ...getEditPermissions('dispatch'),
    'dispatch.assign',
    'field_tools.use', 'field_tools.view_history',
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
    'reports.view_own',
  ];
  await assignPermissionsToRole('CUSTOMER_SERVICE_REPRESENTATIVE', csrPerms);

  // ACCOUNTANT - View access to most, Reports: full
  const accountantPerms = [
    ...getViewPermissions('work_orders'),
    ...getViewPermissions('crm'),
    ...getViewPermissions('inventory'),
    ...getViewPermissions('purchasing'),
    ...getViewPermissions('forecasting'),
    'system.view_dashboard', 'system.view_metrics',
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
    ...getFullAccessPermissions('reports'),
  ];
  await assignPermissionsToRole('ACCOUNTANT', accountantPerms);

  // VIEWER - Read-only access to everything except tenant management
  const viewerPerms = [
    ...getViewPermissions('work_orders'),
    ...getViewPermissions('crm'),
    ...getViewPermissions('inventory'),
    ...getViewPermissions('purchasing'),
    ...getViewPermissions('dispatch'),
    ...getViewPermissions('forecasting'),
    'field_tools.use', 'field_tools.view_history',
    'barcode.lookup',
    'labels.generate',
    'users.read', 'users.list',
    'roles.read', 'roles.list',
    'permissions.read', 'permissions.list',
    'system.view_dashboard', 'system.view_metrics',
    'notifications.read_own',
    'ai_chat.use', 'ai_chat.view_history',
    ...getViewPermissions('reports'),
  ];
  await assignPermissionsToRole('VIEWER', viewerPerms);

  // USER - Limited access to own records
  const userPerms = [
    'work_orders.read_own', 'work_orders.update_own',
    ...getLimitedPermissions('crm'),
    'inventory.skus.read', 'inventory.warehouses.read',
    'field_tools.use', 'field_tools.save_calculations', 'field_tools.view_history',
    'barcode.scan', 'barcode.lookup',
    ...getFullAccessPermissions('notifications'),
    ...getFullAccessPermissions('ai_chat'),
  ];
  await assignPermissionsToRole('USER', userPerms);

  console.log('\n═══════════════════════════════════════════════════');
  console.log('🎉 Complete RBAC System Setup Successful!');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log('📊 Summary:');
  console.log(`  • ${roleDefinitions.length} Roles created/updated`);
  console.log(`  • ${permissionDefinitions.length} Permissions created/updated`);
  console.log('  • All role-permission assignments completed');
  console.log('');
  console.log('👥 Roles:');
  console.log('  1. SUPER_ADMIN - Full system access');
  console.log('  2. OWNER - Full operational access');
  console.log('  3. ADMIN - Tenant administrator');
  console.log('  4. FIELD_MANAGER - Field operations');
  console.log('  5. FIELD_SUPERVISOR - Field supervision');
  console.log('  6. OFFICE_MANAGER - Office & purchasing');
  console.log('  7. WAREHOUSE_MANAGER - Inventory management');
  console.log('  8. TECHNICIAN - Field technician');
  console.log('  9. SALES_REPRESENTATIVE - Sales & CRM');
  console.log('  10. CUSTOMER_SERVICE_REPRESENTATIVE - Customer service');
  console.log('  11. ACCOUNTANT - Financial oversight');
  console.log('  12. VIEWER - Read-only access');
  console.log('  13. USER - Basic user');
  console.log('');
  console.log('✅ Next step: Run `npm run seed:demo` to create demo tenant');
  console.log('═══════════════════════════════════════════════════');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
