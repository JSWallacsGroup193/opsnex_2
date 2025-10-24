import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting dispatch seed...');

  // Get or create tenant
  let tenant = await prisma.tenant.findFirst({
    where: { name: 'HVAC Inc.' },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'HVAC Inc.',
      },
    });
    console.log('✅ Created tenant: HVAC Inc.');
  } else {
    console.log('✅ Found existing tenant: HVAC Inc.');
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create technicians
  const technicianData = [
    { email: 'john.smith@hvac.com', firstName: 'John', lastName: 'Smith' },
    { email: 'sarah.jones@hvac.com', firstName: 'Sarah', lastName: 'Jones' },
    { email: 'mike.wilson@hvac.com', firstName: 'Mike', lastName: 'Wilson' },
  ];

  const technicians = [];
  for (const techData of technicianData) {
    let tech = await prisma.user.findUnique({
      where: { email: techData.email },
    });

    if (!tech) {
      tech = await prisma.user.create({
        data: {
          email: techData.email,
          password: hashedPassword,
          firstName: techData.firstName,
          lastName: techData.lastName,
          jobTitle: 'HVAC Technician',
          tenantId: tenant.id,
        },
      });
      console.log(`✅ Created technician: ${techData.firstName} ${techData.lastName}`);
    } else {
      console.log(`✅ Found existing technician: ${techData.firstName} ${techData.lastName}`);
    }
    technicians.push(tech);
  }

  // Create customer accounts
  const customerData = [
    { name: 'ABC Manufacturing', industry: 'Manufacturing' },
    { name: 'Downtown Office Plaza', industry: 'Commercial Real Estate' },
    { name: 'City Hospital', industry: 'Healthcare' },
    { name: 'Tech Startup Hub', industry: 'Technology' },
    { name: 'Retail Mall Complex', industry: 'Retail' },
  ];

  const customers = [];
  for (let i = 0; i < customerData.length; i++) {
    const custData = customerData[i];
    let customer = await prisma.account.findFirst({
      where: { name: custData.name },
    });

    if (!customer) {
      customer = await prisma.account.create({
        data: {
          name: custData.name,
          industry: custData.industry,
          accountNumber: `ACC-${1000 + i}`,
          tenant: {
            connect: { id: tenant.id },
          },
        },
      });
      console.log(`✅ Created customer: ${custData.name}`);
    } else {
      console.log(`✅ Found existing customer: ${custData.name}`);
    }
    customers.push(customer);
  }

  // Create work orders
  const workOrderData = [
    { title: 'AC Unit Maintenance', description: 'Quarterly maintenance for rooftop AC units', priority: 'MEDIUM', status: 'SCHEDULED', customer: 0 },
    { title: 'Heating System Repair', description: 'Boiler not heating properly in building B', priority: 'HIGH', status: 'SCHEDULED', customer: 1 },
    { title: 'Duct Cleaning', description: 'Complete duct cleaning and sanitization', priority: 'LOW', status: 'SCHEDULED', customer: 2 },
    { title: 'Emergency Chiller Repair', description: 'Main chiller unit down - critical', priority: 'URGENT', status: 'SCHEDULED', customer: 3 },
    { title: 'Thermostat Installation', description: 'Install smart thermostats in 5 offices', priority: 'MEDIUM', status: 'SCHEDULED', customer: 4 },
    { title: 'Ventilation Inspection', description: 'Annual ventilation system inspection', priority: 'LOW', status: 'SCHEDULED', customer: 0 },
    { title: 'Refrigeration Unit Check', description: 'Walk-in cooler temperature issues', priority: 'HIGH', status: 'SCHEDULED', customer: 1 },
  ];

  const workOrders = [];
  for (let i = 0; i < workOrderData.length; i++) {
    const woData = workOrderData[i];
    const workOrder = await prisma.workOrder.create({
      data: {
        number: `WO-2025-${String(1000 + i).padStart(6, '0')}`,
        title: woData.title,
        description: woData.description,
        priority: woData.priority as any,
        status: woData.status as any,
        customerId: customers[woData.customer].id,
        tenantId: tenant.id,
      },
    });
    workOrders.push(workOrder);
    console.log(`✅ Created work order: ${woData.title}`);
  }

  // Create dispatch slots - mix of assigned and unassigned
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const dispatchData = [
    // Assigned to John Smith
    { workOrder: 0, technician: 0, day: 0, startHour: 8, endHour: 10 },
    { workOrder: 1, technician: 0, day: 0, startHour: 13, endHour: 16 },
    
    // Assigned to Sarah Jones
    { workOrder: 2, technician: 1, day: 1, startHour: 9, endHour: 12 },
    { workOrder: 3, technician: 1, day: 2, startHour: 8, endHour: 11 },
    
    // Assigned to Mike Wilson
    { workOrder: 4, technician: 2, day: 1, startHour: 14, endHour: 17 },
    
    // Unassigned (null technician)
    { workOrder: 5, technician: null, day: 3, startHour: 10, endHour: 13 },
    { workOrder: 6, technician: null, day: 4, startHour: 8, endHour: 12 },
  ];

  for (const dispatchItem of dispatchData) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + dispatchItem.day);
    
    const startTime = new Date(slotDate);
    startTime.setHours(dispatchItem.startHour, 0, 0, 0);
    
    const endTime = new Date(slotDate);
    endTime.setHours(dispatchItem.endHour, 0, 0, 0);

    await prisma.dispatchSlot.create({
      data: {
        workOrderId: workOrders[dispatchItem.workOrder].id,
        technicianId: dispatchItem.technician !== null ? technicians[dispatchItem.technician].id : null,
        startTime,
        endTime,
        status: 'scheduled',
      },
    });
    
    const techName = dispatchItem.technician !== null 
      ? `${technicianData[dispatchItem.technician].firstName} ${technicianData[dispatchItem.technician].lastName}`
      : 'Unassigned';
    console.log(`✅ Created dispatch slot: ${workOrderData[dispatchItem.workOrder].title} → ${techName}`);
  }

  console.log('\n🎉 Dispatch seed complete!');
  console.log('\n📊 Summary:');
  console.log(`   • ${technicians.length} technicians created`);
  console.log(`   • ${customers.length} customer accounts created`);
  console.log(`   • ${workOrders.length} work orders created`);
  console.log(`   • ${dispatchData.length} dispatch slots created`);
  console.log('\n👥 Technicians:');
  technicianData.forEach((tech) => {
    console.log(`   • ${tech.firstName} ${tech.lastName} (${tech.email})`);
  });
  console.log('\n🔐 Default password: password123');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
