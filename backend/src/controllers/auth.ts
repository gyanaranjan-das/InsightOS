import { Request, Response } from 'express';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, orgName } = req.body;

    if (!email || !password || !name || !orgName) {
      res.status(400).json({ error: 'All fields required', code: 'MISSING_FIELDS' });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ error: 'Email already registered', code: 'EMAIL_EXISTS' });
      return;
    }

    const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const org = await Organization.create({ name: orgName, slug });
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      name,
      role: 'OWNER',
      orgId: org._id,
    });

    const tokenPayload = {
      userId: user._id.toString(),
      orgId: org._id.toString(),
      role: user.role,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      org: {
        id: org._id,
        name: org.name,
        slug: org.slug,
        plan: org.plan,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', code: 'REGISTER_ERROR' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required', code: 'MISSING_FIELDS' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials', code: 'INVALID_CREDS' });
      return;
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials', code: 'INVALID_CREDS' });
      return;
    }

    const org = await Organization.findById(user.orgId);
    const tokenPayload = {
      userId: user._id.toString(),
      orgId: user.orgId.toString(),
      role: user.role,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      org: org ? {
        id: org._id,
        name: org.name,
        slug: org.slug,
        plan: org.plan,
      } : null,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', code: 'LOGIN_ERROR' });
  }
}

export async function logout(req: AuthRequest, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

    }

    if (req.user) {
      await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed', code: 'LOGOUT_ERROR' });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required', code: 'NO_REFRESH' });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({ error: 'Invalid refresh token', code: 'INVALID_REFRESH' });
      return;
    }

    const tokenPayload = {
      userId: user._id.toString(),
      orgId: user.orgId.toString(),
      role: user.role,
    };

    const newAccessToken = signAccessToken(tokenPayload);
    const newRefreshToken = signRefreshToken(tokenPayload);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token', code: 'INVALID_REFRESH' });
  }
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated', code: 'NOT_AUTH' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-passwordHash -refreshToken');
    if (!user) {
      res.status(404).json({ error: 'User not found', code: 'USER_NOT_FOUND' });
      return;
    }

    const org = await Organization.findById(user.orgId);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        mfaEnabled: user.mfaEnabled,
      },
      org: org ? {
        id: org._id,
        name: org.name,
        slug: org.slug,
        plan: org.plan,
      } : null,
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Failed to fetch user', code: 'FETCH_ERROR' });
  }
}
