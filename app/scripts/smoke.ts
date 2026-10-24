const base=process.env.APP_URL||'http://localhost:7316';const ORG='00000000-0000-0000-0000-000000000007';const EMAIL='ops@msp.co.ke';
async function req(p,o={}){const r=await fetch(base+p,{...o,headers:{'content-type':'application/json','x-dev-user-email':EMAIL,'x-org-id':ORG,...(o.headers||{})}});return{status:r.status,json:await r.json().catch(()=>({}))};}
(async()=>{
  const t=async(n,fn)=>{try{await fn();console.log(`✅ ${n}`)}catch(e){console.log(`❌ ${n} — `+String(e))}};
  await t('health', async()=>{if((await req('/api/v1/health')).status!==200) throw new Error('bad');});
  await t('customer→env→migration→approve', async()=>{
    const c=await req('/api/v1/customers');
    if(c.status!==200) throw new Error('customers failed');
    const id=(c.json as any).data[0].id;
    const e=await req('/api/v1/environments',{method:'POST',body:JSON.stringify({customerId:id,name:'smoke-env-'+Date.now(),provider:'AWS',region:'af-south-1'})});
    if(e.status!==200) throw new Error('env failed');
    const m=await req('/api/v1/migrations',{method:'POST',body:JSON.stringify({customerId:id,sourceEnv:'on-prem',targetEnv:'aws',scope:{db:true}})});
    if(m.status!==200) throw new Error('migration failed');
    const mid=(m.json as any).data.id;
    const ap=await req(`/api/v1/migrations/${mid}/approve`,{method:'POST'});
    if(ap.status!==200) throw new Error('approve failed');
  });
})();
