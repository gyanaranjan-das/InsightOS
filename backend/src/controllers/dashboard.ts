import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Dashboard } from '../models/Dashboard';
import { Project } from '../models/Project';

export async function listDashboards(req: AuthRequest, res: Response): Promise<void> {
  try {
    const dashboards = await Dashboard.find({ orgId: req.user!.orgId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(dashboards);
  } catch (error) {
    console.error('List dashboards error:', error);
    res.status(500).json({ error: 'Failed to list dashboards', code: 'LIST_ERROR' });
  }
}

export async function createDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name, projectId } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Dashboard name required', code: 'MISSING_NAME' });
      return;
    }

    const project = projectId
      ? await Project.findById(projectId)
      : await Project.findOne({ orgId: req.user!.orgId });

    if (!project) {
      res.status(404).json({ error: 'Project not found', code: 'PROJECT_NOT_FOUND' });
      return;
    }

    const dashboard = await Dashboard.create({
      name,
      projectId: project._id,
      orgId: req.user!.orgId,
      layout: { columns: 2, rows: 3 },
      widgets: [
        { type: 'metric', title: 'Total Events', metric: 'totalEvents', position: { x: 0, y: 0 } },
        { type: 'metric', title: 'Unique Users', metric: 'uniqueUsers', position: { x: 1, y: 0 } },
        { type: 'chart', title: 'Events Over Time', chartType: 'line', position: { x: 0, y: 1 } },
        { type: 'chart', title: 'Top Events', chartType: 'bar', position: { x: 1, y: 1 } },
      ],
    });

    res.status(201).json(dashboard);
  } catch (error) {
    console.error('Create dashboard error:', error);
    res.status(500).json({ error: 'Failed to create dashboard', code: 'CREATE_ERROR' });
  }
}

export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const dashboard = await Dashboard.findOne({
      _id: req.params.id,
      orgId: req.user!.orgId,
    }).lean();

    if (!dashboard) {
      res.status(404).json({ error: 'Dashboard not found', code: 'NOT_FOUND' });
      return;
    }

    res.json(dashboard);
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard', code: 'GET_ERROR' });
  }
}

export async function updateDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { layout, widgets, name } = req.body;

    const update: Record<string, unknown> = {};
    if (layout) update.layout = layout;
    if (widgets) update.widgets = widgets;
    if (name) update.name = name;

    const dashboard = await Dashboard.findOneAndUpdate(
      { _id: req.params.id, orgId: req.user!.orgId },
      update,
      { new: true }
    );

    if (!dashboard) {
      res.status(404).json({ error: 'Dashboard not found', code: 'NOT_FOUND' });
      return;
    }

    res.json(dashboard);
  } catch (error) {
    console.error('Update dashboard error:', error);
    res.status(500).json({ error: 'Failed to update dashboard', code: 'UPDATE_ERROR' });
  }
}

export async function deleteDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const result = await Dashboard.findOneAndDelete({
      _id: req.params.id,
      orgId: req.user!.orgId,
    });

    if (!result) {
      res.status(404).json({ error: 'Dashboard not found', code: 'NOT_FOUND' });
      return;
    }

    res.json({ message: 'Dashboard deleted' });
  } catch (error) {
    console.error('Delete dashboard error:', error);
    res.status(500).json({ error: 'Failed to delete dashboard', code: 'DELETE_ERROR' });
  }
}
