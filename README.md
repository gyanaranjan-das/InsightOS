# InsightOS

AI-Powered SaaS Analytics Platform.

## Quick Start
1. Clone: \`git clone <repo-url> && cd insightos\`
2. Copy env: \`cp .env.example .env\` and fill in your API keys
3. Start all services: \`docker-compose up --build\`
4. Seed the database: \`docker exec -it <backend_container_id> npm run seed\`
5. Open http://localhost:3000
6. Login with: admin@demo.com / password: demo1234

## Manual (no Docker)
### Backend
\`\`\`bash
cd backend
npm install
npm run seed
npm run dev
\`\`\`
*(runs on port 4000)*

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*(runs on port 3000)*

## Environment Variables (copy from .env.example)
DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_REFRESH_SECRET, OPENAI_API_KEY, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SOCKET_URL
