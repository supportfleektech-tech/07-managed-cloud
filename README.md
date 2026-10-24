# Managed Local Cloud & SaaS Infrastructure

**Portfolio lane:** MEDIUM  
**Target time to first paid deployment:** 4–10 weeks for managed hosting/migration service; 9–24 months for serious infrastructure product

> Build a real, production-capable commercial product. Do not create demo-only flows, fake integrations, hard-coded records, placeholder APIs, or screenshot-level UI that cannot execute the underlying workflow.

## Mission
Local-region application hosting, managed databases, backups, observability, security hardening, migration and managed DevOps for Kenyan SMEs and software vendors.

## Commercial model
KSh 2,500–100,000+/month per workload; migration fees; managed support retainers; backup/security add-ons.

## Dependencies / external gates
Data-center/host partners; bandwidth; security tooling; backup provider; business continuity plan.

## Portfolio role
Fastest path is a managed service using existing infrastructure. Own hardware/cloud control plane comes later.


## Definition of done
- Multi-tenant isolation is enforced server-side.
- Authentication, authorization, audit logging, rate limiting and error handling are production-grade.
- Primary customer workflow works end-to-end against real integrations or a documented partner sandbox.
- Data migrations are repeatable.
- Automated tests cover critical paths and failure cases.
- Observability, backups, rollback and incident procedures exist.
- Billing can charge a real customer.
- Production deployment is reproducible from a clean environment.
- Documentation is sufficient for a second engineer to operate the system.

## Build order
1. Validation and narrow ICP.
2. Domain model and tenant/security kernel.
3. Critical workflow.
4. Real integrations.
5. Billing + audit + notifications.
6. Hardening + observability.
7. Pilot with paid design partners.
8. General availability.

## Do not build yet
List non-essential features in `PRD.md` and explicitly defer them.
