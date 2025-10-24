import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedServiceCatalog() {
  console.log('🌱 Seeding Service Catalog...');

  const tenants = await prisma.tenant.findMany();
  
  if (tenants.length === 0) {
    console.log('No tenants found. Please run seed:demo first.');
    return;
  }

  for (const tenant of tenants) {
    console.log(`\n📋 Seeding service catalog for tenant: ${tenant.name}`);

    // Create Labor Rates
    console.log('Creating labor rates...');
    const standardRate = await prisma.laborRate.upsert({
      where: { id: `${tenant.id}-standard-rate` },
      update: {},
      create: {
        id: `${tenant.id}-standard-rate`,
        tenantId: tenant.id,
        rateName: 'Standard Rate',
        rateType: 'regular',
        hourlyRate: 85.00,
        isDefault: true,
        isActive: true,
        description: 'Standard hourly rate for regular service calls',
      },
    });

    await prisma.laborRate.upsert({
      where: { id: `${tenant.id}-master-tech-rate` },
      update: {},
      create: {
        id: `${tenant.id}-master-tech-rate`,
        tenantId: tenant.id,
        rateName: 'Master Technician',
        rateType: 'regular',
        skillLevel: 'master',
        hourlyRate: 125.00,
        isActive: true,
        description: 'Premium rate for master technician services',
      },
    });

    await prisma.laborRate.upsert({
      where: { id: `${tenant.id}-emergency-rate` },
      update: {},
      create: {
        id: `${tenant.id}-emergency-rate`,
        tenantId: tenant.id,
        rateName: 'Emergency Service',
        rateType: 'emergency',
        hourlyRate: 150.00,
        afterHoursMultiplier: 1.5,
        isActive: true,
        description: 'Emergency after-hours service rate',
      },
    });

    await prisma.laborRate.upsert({
      where: { id: `${tenant.id}-weekend-rate` },
      update: {},
      create: {
        id: `${tenant.id}-weekend-rate`,
        tenantId: tenant.id,
        rateName: 'Weekend Rate',
        rateType: 'weekend',
        hourlyRate: 105.00,
        afterHoursMultiplier: 1.25,
        isActive: true,
        description: 'Weekend and holiday service rate',
      },
    });

    // Create Flat Rate Services
    console.log('Creating flat rate services...');
    const acTuneUp = await prisma.serviceCatalog.upsert({
      where: { serviceCode: `${tenant.id}-AC-TUNE-UP` },
      update: {},
      create: {
        serviceCode: `${tenant.id}-AC-TUNE-UP`,
        tenantId: tenant.id,
        serviceName: 'AC Tune-Up',
        category: 'Maintenance',
        subcategory: 'Air Conditioning',
        description: 'Complete air conditioning system inspection, cleaning, and tune-up service',
        pricingType: 'flat_rate',
        basePrice: 149.99,
        estimatedHours: 1.5,
        durationMinutes: 90,
        warrantyDays: 30,
        isSeasonalService: true,
        availableSeasons: ['spring', 'summer'],
        isActive: true,
        customerFacingNotes: 'Includes filter replacement, coil cleaning, refrigerant check, and system performance test',
      },
    });

    const furnaceInspection = await prisma.serviceCatalog.upsert({
      where: { serviceCode: `${tenant.id}-FURN-INSPECT` },
      update: {},
      create: {
        serviceCode: `${tenant.id}-FURN-INSPECT`,
        tenantId: tenant.id,
        serviceName: 'Furnace Inspection',
        category: 'Maintenance',
        subcategory: 'Heating',
        description: 'Comprehensive furnace safety and efficiency inspection',
        pricingType: 'flat_rate',
        basePrice: 89.99,
        estimatedHours: 1.0,
        durationMinutes: 60,
        warrantyDays: 30,
        isSeasonalService: true,
        availableSeasons: ['fall', 'winter'],
        isActive: true,
        customerFacingNotes: 'Safety inspection, efficiency test, and performance report',
      },
    });

    await prisma.serviceCatalog.upsert({
      where: { serviceCode: `${tenant.id}-FILTER-REPLACE` },
      update: {},
      create: {
        serviceCode: `${tenant.id}-FILTER-REPLACE`,
        tenantId: tenant.id,
        serviceName: 'Filter Replacement',
        category: 'Maintenance',
        description: 'Standard air filter replacement service',
        pricingType: 'flat_rate',
        basePrice: 49.99,
        estimatedHours: 0.25,
        durationMinutes: 15,
        isActive: true,
        customerFacingNotes: 'Includes standard MERV 8 filter',
      },
    });

    await prisma.serviceCatalog.upsert({
      where: { serviceCode: `${tenant.id}-DUCT-CLEAN` },
      update: {},
      create: {
        serviceCode: `${tenant.id}-DUCT-CLEAN`,
        tenantId: tenant.id,
        serviceName: 'Duct Cleaning',
        category: 'Maintenance',
        subcategory: 'Duct Work',
        description: 'Professional duct system cleaning and sanitization',
        pricingType: 'flat_rate',
        basePrice: 399.99,
        estimatedHours: 3.0,
        durationMinutes: 180,
        warrantyDays: 90,
        isActive: true,
        customerFacingNotes: 'Complete duct system cleaning with antimicrobial treatment',
      },
    });

    await prisma.serviceCatalog.upsert({
      where: { serviceCode: `${tenant.id}-TSTAT-INSTALL` },
      update: {},
      create: {
        serviceCode: `${tenant.id}-TSTAT-INSTALL`,
        tenantId: tenant.id,
        serviceName: 'Thermostat Installation',
        category: 'Installation',
        description: 'Professional thermostat installation and setup',
        pricingType: 'flat_rate',
        basePrice: 129.99,
        estimatedHours: 1.0,
        durationMinutes: 60,
        warrantyDays: 365,
        isActive: true,
        customerFacingNotes: 'Includes wiring, mounting, and smart thermostat programming',
      },
    });

    // Create Hourly Services
    console.log('Creating hourly services...');
    await prisma.serviceCatalog.upsert({
      where: { serviceCode: `${tenant.id}-DIAGNOSTIC` },
      update: {},
      create: {
        serviceCode: `${tenant.id}-DIAGNOSTIC`,
        tenantId: tenant.id,
        serviceName: 'Diagnostic Service',
        category: 'Repair',
        description: 'Comprehensive HVAC system diagnostic and troubleshooting',
        pricingType: 'hourly',
        basePrice: 85.00,
        estimatedHours: 1.0,
        durationMinutes: 60,
        isActive: true,
        customerFacingNotes: 'Diagnostic fee may be waived if repair is completed',
      },
    });

    await prisma.serviceCatalog.upsert({
      where: { serviceCode: `${tenant.id}-GENERAL-REPAIR` },
      update: {},
      create: {
        serviceCode: `${tenant.id}-GENERAL-REPAIR`,
        tenantId: tenant.id,
        serviceName: 'General Repair',
        category: 'Repair',
        description: 'Standard HVAC system repairs',
        pricingType: 'hourly',
        basePrice: 95.00,
        estimatedHours: 2.0,
        minPrice: 95.00,
        maxPrice: 500.00,
        isActive: true,
        customerFacingNotes: 'Parts and materials billed separately',
      },
    });

    await prisma.serviceCatalog.upsert({
      where: { serviceCode: `${tenant.id}-EMERGENCY-SERVICE` },
      update: {},
      create: {
        serviceCode: `${tenant.id}-EMERGENCY-SERVICE`,
        tenantId: tenant.id,
        serviceName: 'Emergency Service Call',
        category: 'Repair',
        description: 'Emergency after-hours HVAC service',
        pricingType: 'hourly',
        basePrice: 150.00,
        estimatedHours: 1.0,
        isEmergency: true,
        isActive: true,
        customerFacingNotes: '24/7 emergency service with priority response',
      },
    });

    // Create Time & Material Services
    console.log('Creating time & material services...');
    await prisma.serviceCatalog.upsert({
      where: { serviceCode: `${tenant.id}-CUSTOM-INSTALL` },
      update: {},
      create: {
        serviceCode: `${tenant.id}-CUSTOM-INSTALL`,
        tenantId: tenant.id,
        serviceName: 'Custom Installation',
        category: 'Installation',
        description: 'Custom HVAC system installation projects',
        pricingType: 'time_and_material',
        basePrice: 0.00,
        estimatedHours: 8.0,
        minPrice: 500.00,
        maxPrice: 15000.00,
        requiresPermit: true,
        isActive: true,
        customerFacingNotes: 'Price based on labor hours and equipment/materials',
      },
    });

    await prisma.serviceCatalog.upsert({
      where: { serviceCode: `${tenant.id}-SYSTEM-MOD` },
      update: {},
      create: {
        serviceCode: `${tenant.id}-SYSTEM-MOD`,
        tenantId: tenant.id,
        serviceName: 'System Modification',
        category: 'Repair',
        description: 'Modifications to existing HVAC systems',
        pricingType: 'time_and_material',
        basePrice: 0.00,
        estimatedHours: 4.0,
        minPrice: 200.00,
        maxPrice: 3000.00,
        isActive: true,
        customerFacingNotes: 'Labor and parts priced based on scope of work',
      },
    });

    // Create Service Bundles
    console.log('Creating service bundles...');
    await prisma.serviceBundle.upsert({
      where: { bundleCode: `${tenant.id}-SPRING-PKG` },
      update: {},
      create: {
        bundleCode: `${tenant.id}-SPRING-PKG`,
        tenantId: tenant.id,
        bundleName: 'Spring HVAC Package',
        description: 'Complete spring maintenance package for AC and filter',
        category: 'Seasonal',
        regularPrice: 199.98,
        bundlePrice: 179.99,
        savings: 19.99,
        savingsPercent: 10.00,
        isActive: true,
        isPromotional: true,
        items: {
          create: [
            { serviceId: acTuneUp.id, quantity: 1, displayOrder: 1 },
          ],
        },
      },
    });

    await prisma.serviceBundle.upsert({
      where: { bundleCode: `${tenant.id}-FALL-PKG` },
      update: {},
      create: {
        bundleCode: `${tenant.id}-FALL-PKG`,
        tenantId: tenant.id,
        bundleName: 'Fall Furnace Package',
        description: 'Complete fall maintenance package for furnace and filter',
        category: 'Seasonal',
        regularPrice: 139.98,
        bundlePrice: 119.99,
        savings: 19.99,
        savingsPercent: 14.29,
        isActive: true,
        isPromotional: true,
        items: {
          create: [
            { serviceId: furnaceInspection.id, quantity: 1, displayOrder: 1 },
          ],
        },
      },
    });

    console.log(`✅ Service catalog seeded for ${tenant.name}`);
  }

  console.log('\n✅ Service catalog seeding completed!\n');
}

seedServiceCatalog()
  .catch((e) => {
    console.error('Error seeding service catalog:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
