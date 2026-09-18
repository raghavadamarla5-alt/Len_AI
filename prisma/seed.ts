import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("Seeding DEMO data...");

  // Create DEMO Authority 1
  await prisma.authority.upsert({
    where: { id: 'auth-1' },
    update: {},
    create: {
      id: 'auth-1',
      name: 'Bapatla Municipal Corporation (DEMO)',
      level: 'Municipality',
      state: 'Andhra Pradesh',
      district: 'Bapatla'
    }
  });

  // Create DEMO Authority 2
  await prisma.authority.upsert({
    where: { id: 'auth-2' },
    update: {},
    create: {
      id: 'auth-2',
      name: 'APEPDCL - Bapatla Circle (DEMO)',
      level: 'State Utility',
      state: 'Andhra Pradesh',
      district: 'Bapatla'
    }
  });

  console.log("Seeding complete. 2 DEMO authorities added.");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
