import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCRMAndPurchasing() {
  console.log('🌱 Seeding CRM and Purchasing data...');

  // Get admin user
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@hvac.com' },
  });

  if (!adminUser) {
    console.error('❌ Admin user not found. Run seed:admin first.');
    return;
  }

  const tenantId = adminUser.tenantId;

  // Create account
  const account = await prisma.account.upsert({
    where: { accountNumber: 'ACC-001' },
    update: {},
    create: {
      accountNumber: 'ACC-001',
      name: 'ACME Corporation',
      customerType: 'business',
      industry: 'Manufacturing',
      website: 'https://acme.com',
      email: 'contact@acme.com',
      phone: '555-0100',
      tenant: { connect: { id: tenantId } },
    },
  });

  // Create contacts
  const contacts = [
    { name: 'John Smith', email: 'john.smith@acme.com', phone: '555-0100' },
    { name: 'Sarah Johnson', email: 'sarah.j@acme.com', phone: '555-0101' },
    { name: 'Mike Davis', email: 'mdavis@acme.com', phone: '555-0102' },
  ];

  for (const contact of contacts) {
    await prisma.contact.create({
      data: {
        ...contact,
        account: { connect: { id: account.id } },
        tenant: { connect: { id: tenantId } },
      },
    });
  }

  // Create SKUs
  const skuData = [
    { sku: 'HVAC-FILTER-20X20', name: 'Air Filter 20x20', category: 'Filters' },
    { sku: 'HVAC-COIL-EVAP', name: 'Evaporator Coil', category: 'Coils' },
    { sku: 'HVAC-REF-R410A', name: 'Refrigerant R-410A 25lb', category: 'Refrigerant' },
  ];

  const skus = [];
  for (const skuItem of skuData) {
    const created = await prisma.sKU.upsert({
      where: { sku: skuItem.sku },
      update: {},
      create: {
        ...skuItem,
        tenant: { connect: { id: tenantId } },
      },
    });
    skus.push(created);
  }

  // Create purchase orders
  const po1 = await prisma.purchaseOrder.upsert({
    where: { poNumber: 'PO-2025-001' },
    update: {},
    create: {
      poNumber: 'PO-2025-001',
      status: 'OPEN',
      vendorName: 'HVAC Supplier Inc',
      subtotal: 500.00,
      taxAmount: 40.00,
      shippingCost: 25.00,
      totalAmount: 565.00,
      tenant: { connect: { id: tenantId } },
      sku: { connect: { id: skus[0].id } },
      quantity: 50,
    },
  });

  const po2 = await prisma.purchaseOrder.upsert({
    where: { poNumber: 'PO-2025-002' },
    update: {},
    create: {
      poNumber: 'PO-2025-002',
      status: 'RECEIVED',
      vendorName: 'Cooling Parts Direct',
      subtotal: 1200.00,
      taxAmount: 96.00,
      shippingCost: 50.00,
      totalAmount: 1346.00,
      receivedAt: new Date(),
      tenant: { connect: { id: tenantId } },
      sku: { connect: { id: skus[1].id } },
      quantity: 5,
    },
  });

  // Create PO items
  await prisma.purchaseOrderItem.create({
    data: {
      purchaseOrder: { connect: { id: po1.id } },
      sku: { connect: { id: skus[0].id } },
      quantity: 50,
      unitCost: 10.00,
      totalCost: 500.00,
      receivedQty: 0,
    },
  });

  await prisma.purchaseOrderItem.create({
    data: {
      purchaseOrder: { connect: { id: po2.id } },
      sku: { connect: { id: skus[1].id } },
      quantity: 5,
      unitCost: 240.00,
      totalCost: 1200.00,
      receivedQty: 5,
    },
  });

  console.log('✅ CRM and Purchasing seed data created:');
  console.log('   - 1 Account (ACME Corporation)');
  console.log('   - 3 Contacts (John, Sarah, Mike)');
  console.log('   - 3 SKUs (Filters, Coils, Refrigerant)');
  console.log('   - 2 Purchase Orders (1 Open, 1 Received)');
  console.log('   - 2 PO Items');
}

seedCRMAndPurchasing()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
