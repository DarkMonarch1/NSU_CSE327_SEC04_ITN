---
name: ci-preflight
description: Run TypeScript typechecks and Vitest tests in services/api and services/rds-worker
---

# CI Preflight Verification Skill

Execute these verification checks before finalizing any backend changes or committing on branch `Md-Junayed-Uddin`. These mirror the `backend-ci` and `docker-smoke-test` jobs in `.github/workflows/ci-cd.yml`.

## Execution Steps

### 1. Verify Core API Service (`services/api`)
Run TypeScript type-checking and Vitest test suites:
```powershell
cd services/api
npm run typecheck
npm test
cd ../..
```

### 2. Verify RDS Worker Service (`services/rds-worker`)
Run TypeScript type-checking and Vitest test suites:
```powershell
cd services/rds-worker
npm run typecheck
npm test
cd ../..
```

### 3. Validate Docker Compose Configuration
Validate syntax, environment keys, and service definitions in `infrastructure/docker-compose.yml`:
```powershell
docker compose -f infrastructure/docker-compose.yml config
```

## Success Criteria
- Zero TypeScript compiler errors (`tsc --noEmit` exits with 0).
- 100% passing Vitest test suites across all test files.
- Docker compose configuration parses without syntax or schema errors.
