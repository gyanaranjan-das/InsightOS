import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { connectDB } from './config/database';
import { connectRedis } from './utils/redis';
import { setupSocketServer } from './realtime/socketServer';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import aiRoutes from './routes/ai';
import dashboardRoutes from './routes/dashboard';
import orgRoutes from './routes/org';

const app = express();
const server = http.createServer(app);

/* ── Middleware ─────────────────────────────────────────── */
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Routes ────────────────────────────────────────────── */
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/track', eventRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboards', dashboardRoutes);
app.use('/api/org', orgRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── Error Handler ─────────────────────────────────────── */
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
});

/* ── Boot ──────────────────────────────────────────────── */
const PORT = parseInt(process.env.PORT || '4000', 10);

async function bootstrap() {
  await connectDB();
  await connectRedis();
  setupSocketServer(server);

  server.listen(PORT, () => {
    console.log(`🚀 InsightOS API running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export { app, server };
