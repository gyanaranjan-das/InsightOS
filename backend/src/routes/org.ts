import { Router } from 'express';
import { listMembers, inviteMember, updateMemberRole, removeMember, getOrg, updateOrg } from '../controllers/org';
import { authMiddleware } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = Router();

router.get('/', authMiddleware, getOrg);
router.put('/', authMiddleware, requirePermission('canAdmin'), updateOrg);
router.get('/members', authMiddleware, listMembers);
router.post('/invite', authMiddleware, requirePermission('canAdmin'), inviteMember);
router.put('/members/:id', authMiddleware, requirePermission('canAdmin'), updateMemberRole);
router.delete('/members/:id', authMiddleware, requirePermission('canAdmin'), removeMember);

export default router;
