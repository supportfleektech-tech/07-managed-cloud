import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, requireRole } from '@/server/modules/core';

const Create = z.object({ name: z.string().min(1), contact: z.string().optional(), email: z.string().email().optional(), phone: z.string().optional() });
export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => prisma.customer.findMany({ where: { organizationId: ctx.organizationId }, orderBy: { createdAt: 'desc' } }));
}
export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN');
    const body = Create.parse(await req.json());
    const c = await prisma.customer.create({ data: { ...body, organizationId: ctx.organizationId } });
    await audit(ctx, 'customer.create', 'customer', c.id, { name: c.name });
    return c;
  });
}
