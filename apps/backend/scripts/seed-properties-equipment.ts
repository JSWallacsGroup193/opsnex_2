import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏘️ Seeding Properties and Equipment for Demo Tenant...\n');

  const tenant = await prisma.tenant.findFirst({
    where: { name: 'HVAC Demo Corp' },
  });

  if (!tenant) {
    console.error('❌ HVAC Demo Corp tenant not found!');
    return;
  }

  // Get some accounts to attach properties to
  const accounts = await prisma.account.findMany({
    where: { tenantId: tenant.id },
    take: 8,
  });

  console.log(`📍 Creating properties for ${accounts.length} accounts...`);

  for (const account of accounts) {
    // Create 1-2 properties per account
    const propertyCount = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < propertyCount; i++) {
      const propertyType = i === 0 ? 'RESIDENTIAL' : ['COMMERCIAL', 'INDUSTRIAL'][Math.floor(Math.random() * 2)];
      
      // First create the address
      const address = await prisma.address.create({
        data: {
          accountId: account.id,
          addressType: 'service',
          label: propertyType === 'RESIDENTIAL' ? 'Main Building' : `Facility ${i + 1}`,
          addressLine1: `${100 + i * 50} Main Street`,
          city: 'Springfield',
          state: 'IL',
          postalCode: `6270${i}`,
          country: 'USA',
        },
      });

      // Then create the property with the address
      const property = await prisma.property.create({
        data: {
          tenantId: tenant.id,
          accountId: account.id,
          addressId: address.id,
          propertyType: propertyType,
          squareFootage: propertyType === 'RESIDENTIAL' ? 2500 : 15000,
          hvacUnits: Math.floor(Math.random() * 3) + 1,
          buildingAge: 2025 - (2000 + Math.floor(Math.random() * 20)),
        },
      });

      const propertyLabel = `${account.name} - ${address.label}`;
      console.log(`  ✅ Property: ${propertyLabel} (${propertyType})`);

      // Create 1-3 equipment per property
      const equipmentCount = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < equipmentCount; j++) {
        const equipmentTypes = ['Air Conditioner', 'Furnace', 'Heat Pump', 'Boiler'];
        const equipmentType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
        const makes = ['Carrier', 'Trane', 'Lennox', 'Rheem', 'York', 'Goodman'];
        const make = makes[Math.floor(Math.random() * makes.length)];
        
        const equipment = await prisma.customerEquipment.create({
          data: {
            propertyId: property.id,
            equipmentType: equipmentType,
            make: make,
            model: `${equipmentType.replace(/\s/g, '-')}-${Math.floor(Math.random() * 9000) + 1000}`,
            serialNumber: `SN${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
            installDate: new Date(2015 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), 1),
            warrantyEndDate: new Date(2025 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), 1),
            locationNotes: `${['Basement', 'Attic', 'Utility Room', 'Roof', 'Mechanical Room'][Math.floor(Math.random() * 5)]}`,
            capacity: `${[2, 3, 4, 5][Math.floor(Math.random() * 4)]} Ton`,
            efficiency: `${[14, 15, 16, 18, 20][Math.floor(Math.random() * 5)]} SEER`,
            status: 'active',
          },
        });

        console.log(`    🔧 Equipment: ${equipment.equipmentType} (${equipment.make})`);
      }
    }
  }

  // Count final results
  const propertyCount = await prisma.property.count({ 
    where: { tenantId: tenant.id } 
  });
  
  const equipmentCount = await prisma.customerEquipment.count({ 
    where: { 
      property: { 
        tenantId: tenant.id 
      } 
    } 
  });

  console.log('\n═══════════════════════════════════════════════════');
  console.log('🎉 Properties & Equipment Seeding Complete!');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Created ${propertyCount} properties`);
  console.log(`✅ Created ${equipmentCount} equipment items`);
  console.log('═══════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
