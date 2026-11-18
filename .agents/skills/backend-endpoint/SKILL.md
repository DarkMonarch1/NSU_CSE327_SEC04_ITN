---
name: backend-endpoint
description: Scaffold Express route, controller, and Supertest test matching smartAdvisorStore.tsx
---

# Backend Endpoint Implementation Workflow

Follow this procedure whenever implementing or extending backend endpoints in `services/api` to serve features requested for the SmartAdvisor Web application.

## Workflow Steps

### Step 1: Match Canonical Contracts
Before writing any backend code:
1. Examine canonical TypeScript interfaces in [index.ts](file:///f:/antigravity/CSE%20327/apps/web/src/types/index.ts) (`StudentProfile`, `CourseSection`, `ExceptionCase`, `BypassRule`, `AuditLogItem`, `AdminMetrics`, `EscalationItem`, `ScheduleReceipt`).
2. Inspect the corresponding state handler and business logic in [smartAdvisorStore.tsx](file:///f:/antigravity/CSE%20327/apps/web/src/store/smartAdvisorStore.tsx) (e.g., `stageSection`, `confirmSchedule`, `approveException`, `expandCapacity`, `allocateEmergencySection`).
3. Ensure all request payloads and response shapes match the frontend 1-to-1.

### Step 2: Implement Modular Express Routers
In `services/api/src/routes/`:
1. Define modular route handlers and controllers adhering to RESTful conventions (e.g. `bootstrap.ts`, `student.ts`, `faculty.ts`, `admin.ts`, `demo.ts`).
2. Validate incoming request parameters, headers, and body payloads.
3. For transactional state mutations (e.g., course seat reservation/enrollment):
   - Wrap operations in PostgreSQL transactions with `SELECT ... FOR UPDATE` row-level locking.
   - Publish real-time events over Redis Pub/Sub (`smartadvisor-sync`) and broadcast to connected WebSocket clients within &le;500ms.
4. For background processing, enqueue tasks to BullMQ queue (`rds-enrollment-queue`) for `services/rds-worker`.

### Step 3: Write Integration Tests with Vitest & Supertest
In `services/api/src/routes/*.test.ts`:
1. Write integration test cases using Supertest against Express `app`.
2. Test happy paths, boundary validations, error handling, and expected HTTP status codes.
3. Verify returned payload structures match the contract interfaces.

### Step 4: Verify via CI Preflight
Verify the backend stack before committing:
1. Run the `ci-preflight` skill checks:
   - `cd services/api && npm run typecheck && npm test`
   - `cd services/rds-worker && npm run typecheck && npm test`
   - `docker compose -f infrastructure/docker-compose.yml config`
2. Confirm zero TypeScript errors and 100% passing test suites.
