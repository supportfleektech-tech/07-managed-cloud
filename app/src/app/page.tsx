import { prisma } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const org = await prisma.organization.findFirst();
  let stats = { customers: 0, envs: 0, runningMig: 0 };
  let rec: { id: string; sourceEnv: string; targetEnv: string; status: string; customer: { name: string } }[] = [];
  if (org) {
    const [customers, envs, running, migs] = await Promise.all([
      prisma.customer.count({ where: { organizationId: org.id } }),
      prisma.environment.count({ where: { organizationId: org.id } }),
      prisma.migrationJob.count({ where: { organizationId: org.id, status: 'RUNNING' } }),
      prisma.migrationJob.findMany({ where: { organizationId: org.id }, orderBy: { createdAt: 'desc' }, take: 5, include: { customer: { select: { name: true } } } }),
    ]);
    stats = { customers, envs, runningMig: running };
    rec = migs;
  }
  return (
    <>
      <h1>Dashboard</h1>
      {!org && <div className="card">No organization yet. Seed via seed script.</div>}
      {org && <>
        <div className="grid">
          <div className="card"><h3>Customers</h3><div className="big">{stats.customers}</div></div>
          <div className="card"><h3>Environments</h3><div className="big">{stats.envs}</div></div>
          <div className="card"><h3>Running migrations</h3><div className="big">{stats.runningMig}</div></div>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Recent migrations</h3>
          <table>
            <thead><tr><th>Customer</th><th>From</th><th>To</th><th>Status</th></tr></thead>
            <tbody>
              {rec.map(m => <tr key={m.id}><td>{m.customer.name}</td><td>{m.sourceEnv}</td><td>{m.targetEnv}</td><td><span className={`badge s-${m.status}`}>{m.status}</span></td></tr>)}
              {rec.length === 0 && <tr><td colSpan={4}>No migrations yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </>}
    </>
  );
}
