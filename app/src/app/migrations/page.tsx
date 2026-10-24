import { prisma } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function Page() {
  const org = await prisma.organization.findFirst();
  const rows = org ? await prisma.migrationJob.findMany({
    where: { organizationId: org.id }, orderBy: { createdAt: 'desc' }, include: { customer: { select: { name: true } } },
  }) : [];
  return (<><h1>Migrations</h1><div className="card"><table>
    <thead><tr><th>Customer</th><th>From</th><th>To</th><th>Status</th></tr></thead>
    <tbody>
      {rows.map(m => <tr key={m.id}><td>{m.customer.name}</td><td>{m.sourceEnv}</td><td>{m.targetEnv}</td><td><span className={`badge s-${m.status}`}>{m.status}</span></td></tr>)}
      {rows.length === 0 && <tr><td colSpan={4}>No migrations yet.</td></tr>}
    </tbody>
  </table></div></>);
}
