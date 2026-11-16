# SmartAdvisor NSU — Project Overview & Architecture

[![CI/CD Pipeline](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/actions/workflows/ci-cd.yml)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14.x-000000?logo=next.js&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-Stable-02569B?logo=flutter&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)

> **North South University (NSU)**  
> **Department of Electrical & Computer Engineering**  
> **Course:** CSE 327 (Section 04) — Software Engineering  
> **Supervisor:** Intisar Tahmeed Sir [ITN]

---

## 📌 Project Overview

**SmartAdvisor** is an autonomous, high-concurrency course advising and registration engine engineered for North South University to eliminate launch-minute seat contention, prerequisite errors, and manual faculty approval bottlenecks.

### Core Architecture & Capabilities
- **Autonomous DAG & Rule Engine:** Validates curriculum prerequisites via a Directed Acyclic Graph (DAG) and auto-approves compliant advising requests while routing policy exceptions to faculty advisors.
- **Zero Double-Booking (ACID Row-Locking):** Enforces row-level database locking inside PostgreSQL ACID transactions, stress-tested to guarantee zero race conditions during peak seat contention.
- **Real-Time Cross-Platform Sync (&le;500ms):** Synchronizes seat states across React/Next.js Web, Flutter Mobile, and staff dashboards within &le;500 ms using Redis Pub/Sub and WebSockets.
- **Headless RDS Execution Workers:** Leverages Redis BullMQ and headless workers for automated enrollment pushes into NSU RDS with 1-click DAG fallback resolution.

---

## 👥 Team Roster & Git Branch Ownership

Each member develops features on their designated branch and opens pull requests targeting `main`. All pull requests must pass the CI/CD pipeline before merging.

| Team Member | Role | Assigned Branch |
| :--- | :--- | :--- |
| **Jihanur Rahman** | Monorepo Core & CI/CD , Full-Stack | [`Jihanur-Rahman`](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/tree/Jihanur-Rahman) |
| **MD. Sarafat Hossin Talukder Asif** | Web Platform (Next.js) & Mobile Platform (Flutter) | [`MD.-Sarafat-Hossin-Talukder-Asif`](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/tree/MD.-Sarafat-Hossin-Talukder-Asif) |
| **Md Junayed Uddin** | Backend & RDS Integration | [`Md-Junayed-Uddin`](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/tree/Md-Junayed-Uddin) |
| **Sakib Uddin Mahamud** | Deployment, CyberSec | [`Sakib-Uddin-Mahamud`](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/tree/Sakib-Uddin-Mahamud) |

---

## 📂 Monorepo Structure

```text
NSU_CSE327_SEC04_ITN/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # 4-job parallel CI/CD pipeline (backend, web, mobile, docker)
├── apps/
│   ├── web/                      # Next.js App Router + TypeScript + Tailwind CSS web portal
│   └── mobile/                   # Flutter cross-platform mobile client for students
├── services/
│   ├── api/                      # Core Express + TypeScript REST API (`GET /health`)
│   └── rds-worker/               # BullMQ + TypeScript background queue worker
├── infrastructure/
│   └── docker-compose.yml        # PostgreSQL 16, Redis 7, and API container orchestration
├── PROJECT_OVERVIEW.md           # System documentation, monorepo guide & team roster
└── README.md                     # Original repository README
```

---

## 🚀 Local Development & Testing

### 1. Backend Core API (`services/api`)
```bash
cd services/api
npm install
npm run typecheck
npm test
npm start
```
- Health Check: `GET http://localhost:4000/health` &rarr; `{ "status": "ok", "service": "smartadvisor-api" }`

### 2. RDS Queue Worker (`services/rds-worker`)
```bash
cd services/rds-worker
npm install
npm run typecheck
npm test
```

### 3. Web Client (`apps/web`)
```bash
cd apps/web
npm install
npm run lint
npm run build
npm run dev
```
- Web Application: `http://localhost:3000`

### 4. Mobile Client (`apps/mobile`)
```bash
cd apps/mobile
flutter pub get
flutter analyze --no-fatal-infos
flutter test
```

### 5. Infrastructure (Docker Compose)
```bash
docker compose -f infrastructure/docker-compose.yml config
docker compose -f infrastructure/docker-compose.yml up -d
```

---

## 🛡️ CI/CD Pipeline Summary

Our GitHub Actions workflow runs on every push to `main` and on pull requests targeting `main`:

1. **`backend-ci`**: Sets up Node.js 20, runs `npm ci`, typechecks, and executes unit tests for `services/api` and `services/rds-worker`.
2. **`web-ci`**: Sets up Node.js 20, runs `npm ci`, runs ESLint, and compiles the Next.js production bundle in `apps/web`.
3. **`mobile-ci`**: Sets up Flutter (stable), runs `flutter pub get`, performs static analysis (`flutter analyze`), and runs `flutter test` in `apps/mobile`.
4. **`docker-smoke-test`**: Validates `infrastructure/docker-compose.yml` config and builds the `services/api` Docker image.
