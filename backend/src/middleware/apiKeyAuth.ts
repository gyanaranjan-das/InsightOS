import { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project';

export interface ApiKeyRequest extends Request {
  project?: {
    projectId: string;
    orgId: string;
  };
}

export async function apiKeyAuth(
  req: ApiKeyRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const apiKey = req.headers['x-project-key'] as string;
    if (!apiKey) {
      res.status(401).json({ error: 'API key required', code: 'NO_API_KEY' });
      return;
    }

    const project = await Project.findOne({ apiKey });
    if (!project) {
      res.status(401).json({ error: 'Invalid API key', code: 'INVALID_API_KEY' });
      return;
    }

    req.project = {
      projectId: project._id.toString(),
      orgId: project.orgId.toString(),
    };
    next();
  } catch {
    res.status(500).json({ error: 'API key validation failed', code: 'API_KEY_ERROR' });
  }
}
