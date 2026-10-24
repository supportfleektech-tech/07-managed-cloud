import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, HttpError, requireRole } from '@/server/modules/core';

const CreateEnv = z.object({ customerId: z.string().uuid(), name: z.string(), provider: z.enum(['AWS','AZURE','GCP','ON_PREM','HYBRID']), region: z.string(), monthlyCostCents: z.number().int().nonnegative().default(0) });
const StartMigration = z.object({ customerId: z.string().uuid(), sourceEnv: z.string(), targetEnv: z.string(), scope: z.record(z.unknown()) });
const Approve = z.object({});

export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => prisma.environment.findMany({ where: { organizationId: ctx.organizationId }, orderBy: { createdAt: 'desc' }, include: { customer: { select: { name: true } } } }));
}

export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const body = CreateEnv.parse(await req.json());
    const customer = await prisma.customer.findFirst({ where: { id: body.customerId, organizationId: ctx.organizationId } });
    if (!customer) throw new HttpError(404, 'customer not found', 'NOT_FOUND');
    const e = await prisma.environment.create({ data: { organizationId: ctx.organizationId, ...body } });
    await audit(ctx, 'environment.create', 'environment', e.id, { name: e.name, provider: e.provider });
    return e;
  });
}

export async function approveMigration(req: NextRequest, id: string) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN');
    Approve.parse(await req.json().catch(() => ({})));
    const m = await prisma.migrationJob.findFirst({ where: { id, organizationId: ctx.organizationId } });
    if (!m) throw new HttpError(404, 'not found', 'NOT_FOUND');
    const updated = await prisma.migrationJob.update({ where: { id: m.id }, data: { status: 'APPROVED' } });
    await audit(ctx, 'migration.approve', 'migration_job', m.id, {});
    return updated;
  });
}
