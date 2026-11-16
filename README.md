# SmartAdvisor
**CSE 327 (Section 04) — Software Engineering | North South University**  
**Supervisor:** Intisar Tahmeed (ITN)

An autonomous, high-concurrency course advising and registration engine engineered to eliminate launch-minute seat contention, prerequisite errors, and manual approval bottlenecks.

### Core Capabilities
- **Autonomous DAG & Rule Engine:** Validates curriculum prerequisites via a Directed Acyclic Graph and auto-approves compliant requests while routing exceptions to faculty.
- **Zero Double-Booking:** Enforces row-level database locking (`SELECT ... FOR UPDATE`) inside PostgreSQL ACID transactions, stress-tested for 10,000+ concurrent requests.
- **Real-Time Cross-Platform Sync:** Synchronizes seat states across React/Next.js web, Flutter mobile, and staff dashboards within ≤500 ms via Redis Pub/Sub and WebSockets.
- **Headless RDS Execution:** Uses Redis BullMQ and Playwright/Puppeteer workers for automated enrollment pushes with 1-click DAG fallback resolution.
