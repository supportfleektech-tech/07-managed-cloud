import { prisma } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function Page() {
  const org = await prisma.organization.findFirst();
  const rows = org ? await prisma.environment.findMany({ where: { organizationId: org.id }, orderBy: { createdAt: 'desc' }, include: { customer: { select: { name: true } } } }) : [];
  const ksh = (c: number) => `KSh ${(c/100).toLocaleString('en-KE')}`;
  return (<><h1>Environments</h1><div className="card"><table>
    <thead><tr><th>Name</th><th>Customer</th><th>Provider</th><th>Region</th><th>Status</th><th>Monthly</th></tr></thead>
    <tbody>
      {rows.map(e => <tr key={e.id}><td>{e.name}</td><td>{e.customer.name}</td><td>{e.provider}</td><td>{e.region}</td><td><span className={`badge s-${e.status}`}>{e.status}</span></td><td>{ksh(e.monthlyCostCents)}</td></tr>)}
      {rows.length === 0 && <tr><td colSpan={6}>No environments yet.</td></tr>}
    </tbody>
  </table></div></>);
}
