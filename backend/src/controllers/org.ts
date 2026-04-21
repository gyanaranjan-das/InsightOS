import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { hashPassword } from '../utils/password';

export async function listMembers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const members = await User.find({ orgId: req.user!.orgId })
      .select('-passwordHash -refreshToken')
      .sort({ createdAt: 1 })
      .lean();

    res.json(members);
  } catch (error) {
    console.error('List members error:', error);
    res.status(500).json({ error: 'Failed to list members', code: 'LIST_ERROR' });
  }
}

export async function inviteMember(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, name, role } = req.body;

    if (!email || !name) {
      res.status(400).json({ error: 'Email and name required', code: 'MISSING_FIELDS' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ error: 'Email already in use', code: 'EMAIL_EXISTS' });
      return;
    }

    const validRoles = ['ADMIN', 'MEMBER', 'VIEWER'];
    const memberRole = validRoles.includes(role) ? role : 'MEMBER';

    const tempPassword = await hashPassword('changeme123');
    const member = await User.create({
      email,
      name,
      passwordHash: tempPassword,
      role: memberRole,
      orgId: req.user!.orgId,
    });

    res.status(201).json({
      id: member._id,
      email: member.email,
      name: member.name,
      role: member.role,
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({ error: 'Failed to invite member', code: 'INVITE_ERROR' });
  }
}

export async function updateMemberRole(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { role } = req.body;
    const validRoles = ['ADMIN', 'MEMBER', 'VIEWER'];

    if (!validRoles.includes(role)) {
      res.status(400).json({ error: 'Invalid role', code: 'INVALID_ROLE' });
      return;
    }

    const member = await User.findOneAndUpdate(
      { _id: req.params.id, orgId: req.user!.orgId },
      { role },
      { new: true }
    ).select('-passwordHash -refreshToken');

    if (!member) {
      res.status(404).json({ error: 'Member not found', code: 'NOT_FOUND' });
      return;
    }

    res.json(member);
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Failed to update member', code: 'UPDATE_ERROR' });
  }
}

export async function removeMember(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (req.params.id === req.user!.userId) {
      res.status(400).json({ error: 'Cannot remove yourself', code: 'SELF_REMOVE' });
      return;
    }

    const member = await User.findOneAndDelete({
      _id: req.params.id,
      orgId: req.user!.orgId,
      role: { $ne: 'OWNER' },
    });

    if (!member) {
      res.status(404).json({ error: 'Member not found or is owner', code: 'NOT_FOUND' });
      return;
    }

    res.json({ message: 'Member removed' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member', code: 'REMOVE_ERROR' });
  }
}

export async function getOrg(req: AuthRequest, res: Response): Promise<void> {
  try {
    const org = await Organization.findById(req.user!.orgId).lean();
    if (!org) {
      res.status(404).json({ error: 'Organization not found', code: 'NOT_FOUND' });
      return;
    }
    res.json(org);
  } catch (error) {
    console.error('Get org error:', error);
    res.status(500).json({ error: 'Failed to get org', code: 'GET_ERROR' });
  }
}

export async function updateOrg(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { name } = req.body;
    const update: Record<string, unknown> = {};
    if (name) {
      update.name = name;
      update.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const org = await Organization.findByIdAndUpdate(req.user!.orgId, update, { new: true });
    if (!org) {
      res.status(404).json({ error: 'Organization not found', code: 'NOT_FOUND' });
      return;
    }
    res.json(org);
  } catch (error) {
    console.error('Update org error:', error);
    res.status(500).json({ error: 'Failed to update org', code: 'UPDATE_ERROR' });
  }
}
