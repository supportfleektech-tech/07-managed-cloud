# OpenAPI — Managed Cloud (v1)
- GET /health
- GET|POST /customers — {name,contact?,email?,phone?}
- GET|POST /environments — {customerId,name,provider,region,monthlyCostCents?}
- GET|POST /migrations — {customerId,sourceEnv,targetEnv,scope}
- POST /migrations/:id/approve
