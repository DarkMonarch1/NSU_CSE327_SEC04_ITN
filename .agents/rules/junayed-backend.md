---
trigger: always_on
description: Backend & RDS Integration rules and 26-commit policy for Md Junayed Uddin
---

# Backend & RDS Integration Rules & Boundaries — Md Junayed Uddin

## 1. Role & Ownership
- **Services Owned**:
  - `services/api/**`: Express + TypeScript REST and WebSocket server running on port 4000.
  - `services/rds-worker/**`: BullMQ + Redis background queue worker processing jobs on `rds-enrollment-queue`.
  - `infrastructure/docker-compose.yml`: Shared maintenance for PostgreSQL 16 and Redis 7 container orchestration.
  - `apps/web/src/store/smartAdvisorStore.tsx`: Owned in **Commit #26 only** (final live API wire-up).
- **Directory Boundaries & Restrictions**:
  - **Strictly Prohibited**: Never modify `apps/mobile/**` or Next.js UI components in `apps/web/app/**` and `apps/web/src/components/**`.
  - Only backend microservices, workers, container orchestration, and final web store integration are in scope.

## 2. Contract Parity
- **1-to-1 Schema Alignment**: All backend API payloads and responses must strictly match the TypeScript interfaces in `apps/web/src/types/index.ts` and the state structure of `apps/web/src/store/smartAdvisorStore.tsx`:
  - `StudentProfile`
  - `CourseSection`
  - `ExceptionCase`
  - `BypassRule`
  - `AuditLogItem`
  - `AdminMetrics`
  - `EscalationItem`
  - `ScheduleReceipt`
- **ACID Seat Enrollment & Concurrency**:
  - Seat enrollment and reservation flows must execute inside PostgreSQL ACID transactions using `SELECT ... FOR UPDATE` row-level locking on the target section row to guarantee zero race conditions and zero overbooking.
- **Real-Time Cross-Platform Sync**:
  - All database mutations and state transitions must publish events over Redis Pub/Sub (`smartadvisor-sync`) and broadcast via WebSockets to achieve cross-platform synchronization within &le; 500 ms.

## 3. CI/CD Dual-Mode Rule
- **Automated In-Memory Fallback**:
  - Because `.github/workflows/ci-cd.yml` runs `npm test` without starting PostgreSQL or Redis containers, all database and queue layers must support automatic in-memory fallback during `vitest` runs.
  - In production and container environments (`infrastructure/docker-compose.yml`), services connect to live PostgreSQL 16 and Redis 7 instances.
  - In-memory mock/store must seamlessly mirror the exact same ACID constraints and state mutations so that CI tests pass without external services.

## 4. Granular Atomic Commit Policy (26 Commits)
- **Zero Bundling**: Never bundle multiple architectural steps into a single commit.
- **Atomic Milestones**: Maintain dedicated commits across the 26-commit roadmap for:
  - Agent rules, skills, and directory boundaries
  - Shared domain models and TypeScript contracts
  - Database schema, migrations, and seed fixtures
  - In-memory state store and schema validators
  - Real-time WebSocket and Redis Pub/Sub bus
  - Individual portal route modules (`bootstrap`, `student`, `faculty`, `admin`, `demo`)
  - Integration test suites (Supertest / Vitest)
  - RDS queue worker implementation and jobs
  - Docker Compose orchestration
  - Final client store integration (`apps/web/src/store/smartAdvisorStore.tsx` in Commit #26)
- **Mandatory Quality Gate**: Run `npm run typecheck && npm test` in `services/api` and `services/rds-worker` before every commit, ensuring zero compilation errors and 100% passing test suites.
