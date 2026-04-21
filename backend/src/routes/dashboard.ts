import { Router } from 'express';
import { listDashboards, createDashboard, getDashboard, updateDashboard, deleteDashboard } from '../controllers/dashboard';
import { authMiddleware } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = Router();

router.get('/', authMiddleware, listDashboards);
router.post('/', authMiddleware, requirePermission('canEdit'), createDashboard);
router.get('/:id', authMiddleware, getDashboard);
router.put('/:id', authMiddleware, requirePermission('canEdit'), updateDashboard);
router.delete('/:id', authMiddleware, requirePermission('canAdmin'), deleteDashboard);

export default router;
