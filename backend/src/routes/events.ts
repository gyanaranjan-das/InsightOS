import { Router } from 'express';
import { trackEvent, trackBatch, listEvents, eventsSummary, eventsTimeseries, topEvents, funnelAnalysis } from '../controllers/events';
import { apiKeyAuth } from '../middleware/apiKeyAuth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/* ── API Key authenticated (tracking) ──────────────────── */
router.post('/', apiKeyAuth, trackEvent);
router.post('/batch', apiKeyAuth, trackBatch);

/* ── JWT authenticated (analytics) ─────────────────────── */
router.get('/', authMiddleware, listEvents);
router.get('/summary', authMiddleware, eventsSummary);
router.get('/timeseries', authMiddleware, eventsTimeseries);
router.get('/top', authMiddleware, topEvents);
router.post('/funnel', authMiddleware, funnelAnalysis);

export default router;
