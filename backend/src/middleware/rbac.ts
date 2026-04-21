import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

type Permission = 'canView' | 'canEdit' | 'canAdmin';

const ROLE_HIERARCHY: Record<string, number> = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  VIEWER: 1,
};

const PERMISSION_LEVELS: Record<Permission, number> = {
  canView: 1,
  canAdmin: 3,
  canEdit: 2,
};

export function requirePermission(permission: Permission) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated', code: 'NOT_AUTH' });
      return;
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = PERMISSION_LEVELS[permission];

    if (userLevel < requiredLevel) {
      res.status(403).json({ error: 'Insufficient permissions', code: 'FORBIDDEN' });
      return;
    }

    next();
  };
}
