import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, HttpError, requireRole } from '@/server/modules/core';

const Create = z.object({
  customerId: z.string().uuid(),
  sourceEnv: z.string().min(1),
  targetEnv: z.string().min(1),
  scope: z.record(z.unknown()),
});

export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => prisma.migrationJob.findMany({
    where: { organizationId: ctx.organizationId }, orderBy: { createdAt: 'desc' },
    include: { customer: { select: { name: true } } },
  }));
}
export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const body = Create.parse(await req.json());
    const cust = await prisma.customer.findFirst({ where: { id: body.customerId, organizationId: ctx.organizationId } });
    if (!cust) throw new HttpError(404, 'customer not found', 'NOT_FOUND');
    const m = await prisma.migrationJob.create({
      data: { organizationId: ctx.organizationId, ...body, scope: body.scope as object },
    });
    await audit(ctx, 'migration.create', 'migration_job', m.id, {});
    return m;
  });
}
export async function approve(req: NextRequest, id: string) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN');
    const m = await prisma.migrationJob.findFirst({ where: { id, organizationId: ctx.organizationId } });
    if (!m) throw new HttpError(404, 'not found', 'NOT_FOUND');
    if (m.status !== 'PLANNED') throw new HttpError(409, 'not planned', 'BAD_STATE');
    const updated = await prisma.migrationJob.update({ where: { id: m.id }, data: { status: 'APPROVED' } });
    await audit(ctx, 'migration.approve', 'migration_job', m.id, {});
    return updated;
  });
}
