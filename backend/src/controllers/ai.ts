import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AIQuery } from '../models/AIQuery';
import { queryAI } from '../services/ai';

export async function askAI(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Question is required', code: 'MISSING_QUESTION' });
      return;
    }

    const result = await queryAI(
      question,
      req.user!.orgId,
      req.user!.userId
    );

    res.json(result);
  } catch (error) {
    console.error('AI query error:', error);
    res.status(500).json({ error: 'AI query failed', code: 'AI_ERROR' });
  }
}

export async function queryHistory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const orgId = req.user!.orgId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const skip = (page - 1) * limit;

    const [queries, total] = await Promise.all([
      AIQuery.find({ orgId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AIQuery.countDocuments({ orgId }),
    ]);

    res.json({
      queries,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Query history error:', error);
    res.status(500).json({ error: 'Failed to fetch history', code: 'HISTORY_ERROR' });
  }
}
