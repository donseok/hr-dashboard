import { PrismaClient } from '@prisma/client';
import { seedRoles } from './roles.seed';
import { seedDemoData } from './demo-data.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...\n');

  await seedRoles(prisma);
  console.log('');
  await seedDemoData(prisma);

  console.log('\nSeed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
