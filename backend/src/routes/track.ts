import { Router } from 'express';
import { trackEvent, trackBatch } from '../controllers/events';
import { apiKeyAuth } from '../middleware/apiKeyAuth';

const router = Router();

/* ── API Key authenticated (tracking) ──────────────────── */
router.post('/', apiKeyAuth, trackEvent);
router.post('/batch', apiKeyAuth, trackBatch);

export default router;
