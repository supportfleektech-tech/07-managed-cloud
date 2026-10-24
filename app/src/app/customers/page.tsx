import { prisma } from '@/lib/db'
import { CreateCustomerForm } from './ui'
export const dynamic='force-dynamic'
export default async function CustomersPage(){
  const org=await prisma.organization.findFirst()
  const customers=org?await prisma.customer.findMany({where:{organizationId:org.id},orderBy:{createdAt:'desc'}}):[]
  return(
    <>
      <h1>Customers</h1>
      <div className="card" style={{marginBottom:16}}><h3>New customer</h3><CreateCustomerForm/></div>
      <div className="card"><h3>All customers</h3>
        <table>
          <thead><tr><th>Name</th><th>Contact</th><th>Email</th><th>Phone</th></tr></thead>
          <tbody>
            {customers.map(c=>(<tr key={c.id}><td>{c.name}</td><td>{c.contact||'—'}</td><td>{c.email||'—'}</td><td>{c.phone||'—'}</td></tr>))}
            {customers.length===0&&<tr><td colSpan={4}>No customers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}
