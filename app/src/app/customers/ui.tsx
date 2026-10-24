'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export function CreateCustomerForm(){
  const [name,setName]=useState(''); const [contact,setContact]=useState(''); const [email,setEmail]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter()
  return(
    <form onSubmit={async e=>{e.preventDefault();setLoading(true);const res=await fetch('/api/v1/customers',{method:'POST',headers:{'content-type':'application/json','x-dev-user-email':'ops@msp.co.ke','x-org-id':'00000000-0000-0000-0000-000000000007'},body:JSON.stringify({name,contact,email})});setLoading(false);if(res.ok){setName('');setContact('');setEmail('');router.refresh()}else alert('failed')}}>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input placeholder="Contact" value={contact} onChange={e=>setContact(e.target.value)}/>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <button type="submit" disabled={loading}>{loading?'Saving…':'Add customer'}</button>
    </form>
  )
}
