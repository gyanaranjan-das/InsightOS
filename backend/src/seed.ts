import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { Organization } from './models/Organization';
import { User } from './models/User';
import { Project } from './models/Project';
import { Event } from './models/Event';
import { Dashboard } from './models/Dashboard';
import { hashPassword } from './utils/password';

const EVENT_NAMES = [
  'page_view', 'button_click', 'sign_up', 'login',
  'feature_used', 'subscription_started', 'checkout_initiated',
  'payment_completed', 'profile_updated', 'file_uploaded',
  'search_performed', 'item_added_to_cart', 'item_removed_from_cart',
  'onboarding_step_1', 'onboarding_step_2', 'onboarding_step_3',
  'onboarding_completed', 'invite_sent', 'report_generated',
  'settings_changed',
];

const USER_IDS = Array.from({ length: 50 }, (_, i) => `user_${String(i + 1).padStart(3, '0')}`);
const SESSION_IDS = Array.from({ length: 100 }, (_, i) => `sess_${String(i + 1).padStart(4, '0')}`);

function randomDate(daysBack: number): Date {
  const now = Date.now();
  const offset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - offset);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set');
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: 'insightos' });
  console.log('✅ Connected to MongoDB for seeding');

  /* ── Clean existing data ─────────────────────────────── */
  await Promise.all([
    Organization.deleteMany({}),
    User.deleteMany({}),
    Project.deleteMany({}),
    Event.deleteMany({}),
    Dashboard.deleteMany({}),
  ]);
  console.log('🧹 Cleaned existing data');

  /* ── Create org ──────────────────────────────────────── */
  const org = await Organization.create({
    name: 'Demo Organization',
    slug: 'demo-org',
    plan: 'pro',
  });
  console.log(`🏢 Created org: ${org.name}`);

  /* ── Create users ────────────────────────────────────── */
  const adminHash = await hashPassword('demo1234');
  const viewerHash = await hashPassword('viewer1234');

  const admin = await User.create({
    email: 'admin@demo.com',
    passwordHash: adminHash,
    name: 'Alex Johnson',
    role: 'OWNER',
    orgId: org._id,
  });

  const viewer = await User.create({
    email: 'viewer@demo.com',
    passwordHash: viewerHash,
    name: 'Sarah Chen',
    role: 'VIEWER',
    orgId: org._id,
  });

  console.log(`👤 Created users: ${admin.email}, ${viewer.email}`);

  /* ── Create project ──────────────────────────────────── */
  const project = await Project.create({
    name: 'InsightOS Web App',
    orgId: org._id,
  });
  console.log(`📦 Created project: ${project.name} (API Key: ${project.apiKey})`);

  /* ── Create 500 events ───────────────────────────────── */
  const events = Array.from({ length: 500 }, () => ({
    projectId: project._id,
    name: pick(EVENT_NAMES),
    properties: {
      browser: pick(['Chrome', 'Firefox', 'Safari', 'Edge']),
      os: pick(['macOS', 'Windows', 'Linux', 'iOS', 'Android']),
      country: pick(['US', 'UK', 'DE', 'FR', 'IN', 'JP', 'BR', 'CA']),
      version: pick(['1.0', '1.1', '1.2', '2.0']),
    },
    userId: pick(USER_IDS),
    sessionId: pick(SESSION_IDS),
    timestamp: randomDate(30),
  }));

  await Event.insertMany(events);
  console.log(`📊 Created ${events.length} events`);

  /* ── Create dashboard ────────────────────────────────── */
  await Dashboard.create({
    name: 'Main Dashboard',
    projectId: project._id,
    orgId: org._id,
    layout: { columns: 2, rows: 3 },
    widgets: [
      { type: 'metric', title: 'Total Events', metric: 'totalEvents', position: { x: 0, y: 0 } },
      { type: 'metric', title: 'Unique Users', metric: 'uniqueUsers', position: { x: 1, y: 0 } },
      { type: 'metric', title: 'Sessions', metric: 'uniqueSessions', position: { x: 2, y: 0 } },
      { type: 'metric', title: 'Avg Duration', metric: 'avgSessionDuration', position: { x: 3, y: 0 } },
      { type: 'chart', title: 'Events Over Time', chartType: 'line', position: { x: 0, y: 1, w: 2, h: 1 } },
      { type: 'chart', title: 'Top Events', chartType: 'bar', position: { x: 0, y: 2, w: 1, h: 1 } },
    ],
  });
  console.log('📈 Created default dashboard');

  /* ── Summary ─────────────────────────────────────────── */
  console.log('\n🎉 Seed complete!\n');
  console.log('Login credentials:');
  console.log(`  Admin: admin@demo.com / demo1234`);
  console.log(`  Viewer: viewer@demo.com / viewer1234`);
  console.log(`  API Key: ${project.apiKey}\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
