import { Router } from 'express';
import { askAI, queryHistory } from '../controllers/ai';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/query', authMiddleware, askAI);
router.get('/history', authMiddleware, queryHistory);

export default router;
