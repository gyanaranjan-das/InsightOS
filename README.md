<div align="center">
  <img src="https://img.shields.io/badge/Status-Version%201.0.0-brightgreen" alt="Status" />
  <img src="https://img.shields.io/badge/Stack-Next.js%20%7C%20Express%20%7C%20MongoDB-blue" alt="Stack" />
  <img src="https://img.shields.io/badge/AI-OpenAI%20GPT--4o-orange" alt="AI Engine" />
  <img src="https://img.shields.io/badge/License-MIT-purple" alt="License" />

  <h1>InsightOS Analytics Platform</h1>
  <p><b>An AI-Powered SaaS Analytics Engine</b> built for deep event tracking, synchronous realtime dashboards, and generative data insights.</p>
</div>

<br />

## 🪐 Executive Architecture Overview

**InsightOS** is a high-performance, containerized single-tenant capability platform designed specifically to measure SaaS product metrics out-of-the-box. We ingest continuous raw analytics logs across multi-platform networks and dynamically synthesize those behaviors across visual reporting trees driven structurally by Vector Embeddings.

### Core Paradigms
- **Deterministic Funnel Mapping:** Tracked events dynamically bind to relational session properties and construct continuous conversion funnels evaluating drop-off severity.
- **Embedded Conversational Intel (AI):** A dual-layered NLP system translates complex backend queries against raw Mongo data pools. Powered fundamentally by OpenAI `text-embedding-3-small` bindings paired directly with `gpt-4o` completion analysis to detect operational anomalies automatically.
- **Bi-Directional Trackers:** Standard event logs are fired through an HTTP pipeline and simultaneously streamed back directly onto the UI leveraging `Socket.io` layers mapped to your organization’s cluster context.
- **Zero-Trust Access Control:** Multi-tier architectural RBAC ensures internal teams (Owners, Admins, Members, Viewers) authenticate explicitly against standard rotating JWT policies.

---

## 🛠️ Frontier Technology Stack

### Client Architecture
- **Next.js 14 (App Router)**: Utilizing server-side optimizations alongside static edge configurations.
- **Tailwind CSS + shadcn/ui**: Leveraging radical utility-first patterns seamlessly interfaced over Radix UI primitives.
- **Zustand**: Predictable and hook-driven frontend state bindings.

### Server API Backbone
- **Express.js (Node)**: Strongly-typed Typescript API middleware routing.
- **MongoDB Atlas**: Fully-managed schemaless JSON document mappings handling high-bandwidth tracker injection loops.

---

## 🚀 Environment Initialization

Both systems operate concurrently using orchestrator strategies or strictly via local compilation.

### Method 1: Container Orchestration (Docker)
Simply boot the entire ecosystem within isolated layers. Ensure your root `.env` reflects configuration keys.
```bash
# Deploys standard images across port 3000 (front) and 4000 (back)
docker-compose up --build
```

### Method 2: Local Compilation
Navigate to standard endpoints manually via Node.js compilation.
```bash
# Terminal 1 - Boot the Express Services
cd backend
npm install
npm run dev

# Terminal 2 - Bind the Next Application
cd frontend
npm install
npm run dev
```

---

## 🔒 Variables Configuration
Duplicate the standard `.env.example` structure mapped at the root into your local instance and populate specific secure constraints targeting MongoDB clusters, API URLs, and OpenAI boundaries.

```env
# Database
MONGODB_URI=mongodb+srv://<USER>:<PASS>@<YOUR_CLUSTER>.mongodb.net/

# Microservice Boundaries
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
OPENAI_API_KEY=sk-xxxx...

# Cryptographic Protocols
JWT_SECRET=isolated_secret_hash
JWT_REFRESH_SECRET=isolated_refresh_hash
```

---

<div align="center">
    <p>Engineered to track every move. Built to interpret every behavior.</p>
    <br/>
    <p><i>Produced & Maintained by <a href="https://gyanlabs.io">GyanLabs.io Studio</a></i></p>
</div>
