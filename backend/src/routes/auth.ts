import { Router } from 'express';
import { register, login, logout, refresh, me } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.post('/refresh', refresh);
router.get('/me', authMiddleware, me);

export default router;
