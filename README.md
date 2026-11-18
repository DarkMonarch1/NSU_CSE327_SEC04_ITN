# SmartAdvisor NSU

[![CI/CD Pipeline](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/actions/workflows/ci-cd.yml)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14.x-000000?logo=next.js&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-Stable-02569B?logo=flutter&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)

> **North South University (NSU)**  
> **Department of Electrical & Computer Engineering (ECE)**  
> **Course:** CSE 327 (Section 04) — Software Engineering  
> **Supervisor:** Intisar Tahmeed Sir [ITN]

---

## 1. Executive Summary & Core Engineering Pillars

**SmartAdvisor NSU** is an autonomous, high-concurrency course advising and registration platform engineered for North South University. The system is designed to completely eliminate launch-minute seat contention, timetable clashes, prerequisite violations, and manual faculty approval bottlenecks during peak enrollment periods.

### Core Engineering Pillars

1. **Autonomous DAG Prerequisite & Senate Rule Engine**
   - Validates multi-tier curriculum prerequisite trees through an in-memory Directed Acyclic Graph (DAG).
   - Enforces North South University Academic Council policies automatically:
     - `RULE-4.2`: Senior Standing Credit Floor (strictly requires $\ge 100$ earned credits before allowing 400-level courses such as `CSE 425`).
     - `RULE-2.1`: Prerequisite Co-Registration Exemption (permits concurrent enrollment in theory and prerequisite lab for graduating seniors).
     - `RULE-6.3`: Consecutive Exam Load Rebalancer (detects and flags 3 consecutive final examinations within a 24-hour window).
     - `RULE-8.4`: Department Chair $+10$ Seat Override (authorizes emergency capacity expansion up to physical room fire-code safety ceilings).

2. **Zero Double-Booking via PostgreSQL 16 ACID Transactions**
   - Eliminates race conditions and overbooking across thousands of concurrent enrollment requests.
   - Implements strict PostgreSQL row-level pessimistic locking (`SELECT ... FOR UPDATE`) on target section records.
   - Dual-mode architecture seamlessly provides automatic in-memory locking fallbacks with identical concurrency semantics during CI/CD headless test runs.

3. **Sub-500ms Cross-Platform State Synchronization**
   - Instantaneous state dissemination across Web, Mobile, and Staff consoles via Server-Sent Events (`GET /api/v1/events`), backed by Redis 7 Pub/Sub channel `smartadvisor-sync`.
   - Client-side tab federation via browser `BroadcastChannel` and `localStorage` storage events ensures instant reactive updates in $\le 500\text{ ms}$.

4. **Headless NSU RDS Queue Execution**
   - Decoupled asynchronous background execution via BullMQ on `rds-enrollment-queue`.
   - Deterministic SHA-256 cryptographic verification tokens (`SHA256:...`) and receipt transaction numbers (`#RDS-TXN-2025-XXXXX`) generated upon atomic seat commitment.

---

## 2. System Architecture

```mermaid
flowchart TD
    subgraph Clients["Client Applications"]
        Web["Next.js 14 Web Portal<br/>(apps/web :3000)<br/>Student | Faculty | Admin"]
        Mobile["Flutter Mobile Client<br/>(apps/mobile)<br/>Student Companion & Radar"]
    end

    subgraph Edge["API Gateway & Real-Time Sync"]
        API["Express Core API<br/>(services/api :4000)<br/>TypeScript REST & SSE Hub"]
        SSE["SSE Event Stream<br/>(/api/v1/events)"]
        PubSub["Redis 7 Pub/Sub<br/>(smartadvisor-sync)"]
    end

    subgraph DataQueue["State, Persistence & Queue"]
        Postgres[("PostgreSQL 16 DB<br/>(smartadvisor-postgres :5432)<br/>ACID Row-Locking & DDL")]
        RedisQueue[("Redis 7 Broker<br/>(smartadvisor-redis :6379)<br/>rds-enrollment-queue")]
        Worker["BullMQ RDS Worker<br/>(services/rds-worker)<br/>Cryptographic Receipts"]
    end

    Web -->|"REST API Requests"| API
    Mobile -->|"REST API Requests"| API
    API -->|"Broadcasts State"| SSE
    SSE -->|"Real-Time Push (<500ms)"| Web
    SSE -->|"Real-Time Push (<500ms)"| Mobile

    API -->|"SELECT FOR UPDATE"| Postgres
    API -->|"Publish Mutation"| PubSub
    PubSub -->|"State Invalidation"| API

    API -->|"Dispatch Enrollment Job"| RedisQueue
    RedisQueue -->|"Consume & Sign"| Worker
    Worker -->|"SHA-256 Receipt"| Postgres
```

---

## 3. Feature Breakdown by Platform & Role

### 🎓 Student Web Portal (`apps/web` — `/student/dashboard`, `/student/schedule`)

The Student Web Portal provides an interactive advising workflow, real-time conflict checking, prerequisite enforcement, and atomic schedule finalization.

| Route / View | User Action / Interaction | Real-Time Mutation & Sync | Rule Validations & Edge Case Handling |
| :--- | :--- | :--- | :--- |
| `/student/dashboard`<br/>`/student/schedule` | **Section Staging** (`+ Add to Cart`) | Dispatches `POST /api/v1/student/cart/stage`; updates `stagedSectionIds`, broadcasts over SSE and `BroadcastChannel`. | Replaces existing section if same `courseCode` staged; prevents duplicate staging; validates prerequisites against DAG. |
| `/student/schedule` | **Section Removal** (`🗑️ Drop`) | Dispatches `DELETE /api/v1/student/cart/:sectionId`; filters out section and appends `amber` audit log. | Recalculates total staged credits in real time; clears timetable cell allocations without affecting finalized sections. |
| `/student/schedule` | **Timetable Clash Detection** | Matrix analysis evaluates day combinations (`ST`, `MW`, `RA`, `Thu`) and time intervals dynamically. | Prevents simultaneous bookings (e.g., `11:20 AM - 12:50 PM ST`); highlights conflicting section cells in red. |
| `/student/dashboard` | **Rule 4.2 Standing Floor Check** | Intercepts staging attempt when student credits $< 100$; opens `rule_alert` modal with academic standing criteria. | Enforces Senate policy prohibiting 400-level courses (`CSE 425`) for students below Senior Standing; routes to advisor petition. |
| `/student/dashboard` | **Seat Exhaustion Detection** | Detects $0$ available seats on target section; halts staging and opens `section_full` modal. | Automatically queries and displays open alternative sections for the same course code with 1-click alternative selection. |
| `/student/schedule` | **Atomic Schedule Lock** (`Confirm & Lock Schedule`) | Dispatches `POST /api/v1/student/enroll/confirm`; runs PostgreSQL transaction with `SELECT ... FOR UPDATE` row locks. | Increments section `enrolled` counters; computes deterministic SHA-256 digital signature (`SHA256:...`); issues official `#RDS-TXN-2025-XXXXX` receipt. |

---

### 👩‍🏫 Faculty Web Portal (`apps/web` — `/faculty/exceptions`, `/faculty/courses`, `/faculty/rules`)

The Faculty Portal equips department chairs and advisors with automated rule verification, 1-click petition resolution, room capacity governance, and senate policy controls.

| Route / View | User Action / Interaction | Real-Time Mutation & Sync | Rule Validations & Edge Case Handling |
| :--- | :--- | :--- | :--- |
| `/faculty/exceptions` | **6-Point Rule Checklist Audit** | Evaluates student profile against CGPA ($\ge 3.0$), prerequisite DAG, graduation horizon, and fee clearance. | Displays green checkmarks for verified criteria; flags exceptions (e.g., `#EX-2025-0841` Rahim Ahmed missing Rule 4.2 standing). |
| `/faculty/exceptions` | **1-Click Exception Decision** (`Approve`, `Reject`, `Flag`) | Dispatches `POST /api/v1/faculty/exceptions/decision`; updates case status to `approved`, `rejected`, or `flagged`. | On `approve`: atomically increments section `capacity` (+1) and `enrolled` (+1), logs `emerald` audit entry; on `flag`: routes to SAC 502 in-person queue. |
| `/faculty/courses` | **Physical Capacity Expansion** (`+1` to `+15` Seats) | Dispatches `POST /api/v1/faculty/sections/expand-capacity`; adjusts section `capacity` and broadcasts state. | Enforces physical room fire-code safety limit (e.g., `LIB 602` max 55, `SAC 502` max 45); blocks expansion exceeding room threshold. |
| `/faculty/rules` | **Senate Bypass Rule Toggles** (Active / Suspended) | Dispatches `POST /api/v1/faculty/rules/toggle`; toggles `RULE-4.2`, `RULE-2.1`, `RULE-6.3`, or `RULE-8.4`. | Immediately enables or suspends automated checks across the scheduling engine; logs executive committee action to audit trail. |

---

### ⚙️ Admin Operations Portal (`apps/web` — `/admin/health`, `/admin/escalations`)

The Operations & Telemetry Portal provides live system observability, auto-scaling controls, SEV-1 bottleneck resolution, and a classroom surge simulator.

| Route / View | User Action / Interaction | Real-Time Mutation & Sync | Telemetry Thresholds & Operational Policy |
| :--- | :--- | :--- | :--- |
| `/admin/health` | **Live Telemetry & SLA Tracking** | Polling & SSE stream monitors req/s, p95 latency against $200\text{ ms}$ SLA ceiling, and active connection pool. | Highlights latency breaches in red ($>200\text{ ms}$); displays pool exhaustion warnings if active connections approach pool total ($200$). |
| `/admin/health` | **Cluster Auto-Scaling** (`Scale +2 Nodes`) | Dispatches `POST /api/v1/admin/scale`; increments `apiNodes` by $+2$, resets p95 latency to $138\text{ ms}$. | Emulates Kubernetes Horizontal Pod Autoscaler; records scaling event in telemetry and appends `emerald` audit log. |
| `/admin/health` | **Incident Acknowledgment** (`Acknowledge Incident`) | Dispatches `POST /api/v1/admin/acknowledge`; clears `surgeSpikeActive` flag and resets alert banners. | De-escalates critical SEV-1 visual indicators once on-call engineers confirm cluster mitigation. |
| `/admin/escalations` | **SEV-1 Bottleneck Monitoring** | Displays real-time waitlist deficit cards (e.g., `#ESC-9481` for `CSE 327` with 42 waitlisted students). | Categorizes demand by major (B.Sc CSE 66%, B.Sc CS 22%, EEE/ETE 12%); tracks 30-minute demand curves. |
| `/admin/escalations` | **Emergency Section Provisioning** (`Provision Sec 05`) | Dispatches `POST /api/v1/admin/sections/emergency`; creates `CSE 327 Sec 05` (40 seats) in `LIB 608`. | Marks escalation status as `Mitigated`; deducts 40 seats from deficit; broadcasts new section to student cart catalog. |
| `DemoHeader` (Global) | **Surge Simulator & State Reset** (`Trigger Surge`, `Reset`) | `POST /api/v1/demo/surge` (3,450 req/s spike) & `POST /api/v1/demo/reset` (pristine fixture restore). | Injects simulated load spike breaching SLA ($275\text{ ms}$ p95); enables live demonstrations of system resilience and failover. |

---

### 📱 Flutter Mobile Client (`apps/mobile` — Cross-Platform Student Companion)

The Flutter mobile application provides students with on-the-go schedule management, course catalog discovery, petition tracking, and real-time seat drop notifications.

| Screen / View | User Action / Interaction | Mobile State Sync (`ChangeNotifier`) | Feature Capabilities & Rule Integration |
| :--- | :--- | :--- | :--- |
| `DashboardScreen` (`/home`) | View academic progress, standing, and cart token (`#NSU-241215-9042`). | Observes `AppState` fields: completed credits ($96/130$), CGPA ($3.64$), standing (`Senior Standing`). | Displays advising clearance badge from Dr. Nova Ahmed and countdown timer to slot expiration. |
| `CourseCatalogScreen`<br/>`CourseDetailScreen` | Search and filter courses by code, title, and department; inspect prerequisites and syllabus. | Reads section availability, faculty assignments, rooms, and enrolled seat ratios in real time. | Shows live seat status badges (`Available`, `Few Seats Left`, `Full`); verifies prerequisites before staging. |
| `ScheduleScreen` | Weekly timetable visualizer across Sunday through Thursday with time interval blocks. | Dynamically renders `stagedCourses` list across time grids matching NSU class slots. | Color-codes courses; detects overlapping schedules; provides quick 1-tap course detail preview. |
| `PetitionsScreen` | Track submitted academic petitions (`PET-327-01`, `PET-425-01`, `PET-361-02`, `PET-331-01`). | Reflects live petition status: `approved`, `pending`, `waitlisted`, and `rejected`. | Displays auto-approval tokens, advisor review notes, waitlist queue positions, and alternative open sections. |
| `RadarScreen` / Notification Banners | Real-Time Seat Drop Radar & system alerts. | Subscribes to radar alerts (`seat_drop`, `fast_enroll`, `rule_alert`, `clearance`). | Instant push notification when a seat opens in a filled section (e.g., `CSE 327 Sec 02`); 1-tap seat claim action. |

---

## 4. Backend API & Worker Reference

### REST & Real-Time Endpoints (`services/api :4000`)

| Method | Endpoint | Request Payload | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | _None_ | Service health check returning `{ status: "ok", service: "smartadvisor-api" }`. |
| `GET` | `/api/v1/bootstrap` | _None_ | Hydrates the entire portal state (student profile, sections, exceptions, rules, metrics, audit log). |
| `GET` | `/api/v1/events` | _None_ | Server-Sent Events (SSE) stream for sub-500ms real-time state broadcast and cross-platform sync. |
| `POST` | `/api/v1/student/cart/stage` | `{ "sectionId": "CSE327-01" }` | Stages a section into the student cart; validates Rule 4.2 credit floors and seat availability. |
| `DELETE` | `/api/v1/student/cart/:sectionId` | _None_ | Removes a staged course section from student cart and appends an audit log entry. |
| `POST` | `/api/v1/student/enroll/confirm` | _None_ | Atomically locks schedule, increments enrolled counts, generates SHA-256 digital receipt and `#RDS-TXN-...`. |
| `POST` | `/api/v1/faculty/exceptions/decision` | `{ "caseId": "EX-0841", "action": "approve" }` | Processes exception decision (`approve`, `reject`, `flag`); updates section capacity and records audit log. |
| `POST` | `/api/v1/faculty/sections/expand-capacity` | `{ "sectionId": "CSE327-04", "delta": 5 }` | Expands section seat capacity by `delta` up to physical room safety limits. |
| `POST` | `/api/v1/faculty/rules/toggle` | `{ "ruleId": "rule-4-2" }` | Toggles an academic senate bypass rule on/off and broadcasts updated rule state. |
| `POST` | `/api/v1/admin/scale` | _None_ | Simulates cluster auto-scaling (`+2 Nodes`), drops p95 latency to 138 ms, and records scaling event. |
| `POST` | `/api/v1/admin/acknowledge` | _None_ | Acknowledges active SEV-1 surge spike incident, resetting `surgeSpikeActive` flag to false. |
| `POST` | `/api/v1/admin/sections/emergency` | `{ "courseCode": "CSE 327" }` | Provisions an emergency Section 05 (+40 seats), mitigating high-priority escalation queues. |
| `POST` | `/api/v1/admin/courses/add-seats` | `{ "courseCode": "CSE 327", "count": 10 }` | Adds seats across all sections of a course and marks matching escalation resolved. |
| `POST` | `/api/v1/demo/surge` | _None_ | Simulates a 3,450 req/s high-concurrency surge spike, triggering an active SEV-1 incident state. |
| `POST` | `/api/v1/demo/section-full` | `{ "sectionId": "CSE327-01" }` | Simulates real-time seat exhaustion on a section (`enrolled = capacity`). |
| `POST` | `/api/v1/demo/reset` | _None_ | Restores entire dual-mode backend store to pristine initial state fixtures. |

### BullMQ Background Worker (`services/rds-worker`)

- **Queue Name**: `rds-enrollment-queue`
- **Job Payload**:
  ```json
  {
    "studentId": "2412159042",
    "courseCode": "CSE 327",
    "section": 1,
    "semester": "Spring 2025"
  }
  ```
- **Job Result & Cryptographic Token**:
  ```json
  {
    "success": true,
    "studentId": "2412159042",
    "courseCode": "CSE 327",
    "enrolledAt": "2026-11-18T07:19:34.000Z",
    "message": "Successfully processed enrollment for 2412159042 in CSE 327 Sec 1",
    "transactionId": "#RDS-TXN-A3B9F10C",
    "digitalSignature": "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
  ```

---

## 5. Monorepo Directory Structure

```text
NSU_CSE327_SEC04_ITN/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # 4-job parallel CI/CD pipeline (backend, web, mobile, docker)
├── apps/
│   ├── web/                      # Next.js 14 App Router + TypeScript + Tailwind CSS portal
│   │   ├── app/                  # Route handlers: /student, /faculty, /admin, /login
│   │   ├── src/
│   │   │   ├── components/       # Portal UI components & shared modal system
│   │   │   ├── store/            # smartAdvisorStore.tsx (Live API + SSE + Broadcast sync)
│   │   │   └── types/            # TypeScript domain interfaces
│   │   └── package.json
│   └── mobile/                   # Flutter cross-platform mobile client
│       ├── lib/
│       │   ├── models/           # Data models (Course, Petition, Radar Alert)
│       │   ├── state/            # app_state.dart (ChangeNotifier state management)
│       │   ├── screens/          # Dashboard, Catalog, Timetable, Petitions
│       │   └── widgets/          # Shared widgets & status badges
│       └── pubspec.yaml
├── services/
│   ├── api/                      # Core Express + TypeScript REST API (:4000)
│   │   ├── src/
│   │   │   ├── db/               # PostgreSQL 16 schema.sql & connection pool
│   │   │   ├── events/           # sseHub.ts (Server-Sent Events broadcaster)
│   │   │   ├── routes/           # bootstrap, student, faculty, admin, demo routers
│   │   │   ├── services/         # ruleValidator.ts (Prerequisite, clash, Rule 4.2 engine)
│   │   │   ├── store/            # backendStore.ts (ACID dual-mode in-memory & SQL store)
│   │   │   └── app.ts            # Express application entrypoint
│   │   ├── Dockerfile
│   │   └── package.json
│   └── rds-worker/               # BullMQ + Redis background queue worker
│       ├── src/
│       │   ├── worker.ts         # SHA-256 receipt generation & queue processor
│       │   └── index.ts          # Worker runtime process
│       └── package.json
├── infrastructure/
│   └── docker-compose.yml        # PostgreSQL 16, Redis 7, and API container orchestration
├── PROJECT_OVERVIEW.md           # System documentation & architectural roadmap
└── README.md                     # Monorepo technical documentation
```

---

## 6. Team Roster & Git Branch Ownership

Every team member develops features on their designated branch and opens pull requests targeting `main`. All pull requests must pass the complete 4-job CI/CD pipeline before merging.

| Team Member | Role | Assigned Branch |
| :--- | :--- | :--- |
| **Jihanur Rahman** | Monorepo Core & CI/CD, Full-Stack | [`Jihanur-Rahman`](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/tree/Jihanur-Rahman) |
| **MD. Sarafat Hossin Talukder Asif** | Web Platform (Next.js) & Mobile Platform (Flutter) | [`MD.-Sarafat-Hossin-Talukder-Asif`](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/tree/MD.-Sarafat-Hossin-Talukder-Asif) |
| **Md Junayed Uddin** | Backend & RDS Integration | [`Md-Junayed-Uddin`](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/tree/Md-Junayed-Uddin) |
| **Sakib Uddin Mahamud** | Deployment & Cybersecurity | [`Sakib-Uddin-Mahamud`](https://github.com/DarkMonarch1/NSU_CSE327_SEC04_ITN/tree/Sakib-Uddin-Mahamud) |

---

## 7. Local Quickstart Guide

### Prerequisites
- Node.js 20.x LTS & npm 10+
- Flutter SDK (Channel `stable` $\ge 3.24$)
- Docker Engine & Docker Compose v2+

### Step-by-Step Setup

#### 1. Infrastructure (PostgreSQL 16 & Redis 7)
```bash
docker compose -f infrastructure/docker-compose.yml up -d
```
- PostgreSQL 16: `localhost:5432` (`user: smartadvisor`, `db: smartadvisor_db`)
- Redis 7: `localhost:6379`

#### 2. Backend Core API (`services/api`)
```bash
cd services/api
npm install
npm run typecheck
npm test
npm start
```
- API Endpoint: `http://localhost:4000`
- Health Probe: `http://localhost:4000/health`

#### 3. RDS Background Worker (`services/rds-worker`)
```bash
cd services/rds-worker
npm install
npm run typecheck
npm test
npm start
```

#### 4. Web Client (`apps/web`)
```bash
cd apps/web
npm install
npm run lint
npm run build
npm run dev
```
- Web Portal: `http://localhost:3000`

#### 5. Mobile Client (`apps/mobile`)
```bash
cd apps/mobile
flutter pub get
flutter analyze --no-fatal-infos
flutter test
flutter run
```

---

## 8. CI/CD Pipeline Verification

The repository enforces a 4-job parallel CI/CD pipeline in [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) on all pull requests and pushes to `main`:

```bash
# 1. Backend CI (services/api & services/rds-worker)
(cd services/api && npm run typecheck && npm test)
(cd services/rds-worker && npm run typecheck && npm test)

# 2. Web App CI (apps/web)
(cd apps/web && npm run lint && npm run build)

# 3. Mobile App CI (apps/mobile)
(cd apps/mobile && flutter analyze --no-fatal-infos && flutter test)

# 4. Docker Smoke Test (infrastructure)
docker compose -f infrastructure/docker-compose.yml config
docker build -t smartadvisor-api:smoke -f services/api/Dockerfile services/api
```
