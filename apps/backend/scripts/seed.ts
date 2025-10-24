import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  let tenant = await prisma.tenant.findFirst({
    where: { name: 'HVAC Inc.' },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'HVAC Inc.',
      },
    });
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@hvac.com' },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: 'admin@hvac.com',
        password: hashedPassword,
        tenantId: tenant.id,
      },
    });
  }

  console.log('🌱 Seed complete:');
  console.log(`👤 Admin user: admin@hvac.com`);
  console.log(`🔐 Password: password123`);
  console.log(`🏢 Tenant: ${tenant.name}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
