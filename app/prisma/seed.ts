import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: '00000000-0000-0000-0000-000000000007' }, update: {},
    create: { id: '00000000-0000-0000-0000-000000000007', name: 'Demo Cloud MSP', kraPin: 'P000666777F' },
  });
  const user = await prisma.user.upsert({
    where: { email: 'ops@msp.co.ke' }, update: {},
    create: { email: 'ops@msp.co.ke', name: 'Ops Lead' },
  });
  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
    update: { role: 'OWNER' },
    create: { userId: user.id, organizationId: org.id, role: 'OWNER' },
  });
  const cust = await prisma.customer.create({ data: { organizationId: org.id, name: 'SME Co', email: 'it@smeco.co.ke' } });
  await prisma.environment.create({ data: { organizationId: org.id, customerId: cust.id, name: 'prod', provider: 'AWS', region: 'af-south-1', monthlyCostCents: 4500000, status: 'ACTIVE' } });
  await prisma.migrationJob.create({ data: { organizationId: org.id, customerId: cust.id, sourceEnv: 'on-prem', targetEnv: 'aws-af-south-1', scope: { vms: 12, db: 'postgres' }, status: 'RUNNING' } });
  console.log('seeded', { org: org.id, user: user.email });
}
main().finally(() => prisma.$disconnect());
