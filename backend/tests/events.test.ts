import request from 'supertest';
import { app } from '../src/index';
import { Project } from '../src/models/Project';
import { Organization } from '../src/models/Organization';
import { User } from '../src/models/User';
import mongoose from 'mongoose';
import { signAccessToken } from '../src/utils/jwt';

describe('Events API', () => {
  let apiKey = '';
  let token = '';

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insightos_test');
    
    const org = await Organization.create({ name: 'Event Test Org', slug: 'event-test' });
    const user = await User.create({ email: 'event@test.com', passwordHash: 'hash', name: 'Tester', role: 'OWNER', orgId: org._id });
    const project = await Project.create({ name: 'Test Project', orgId: org._id });
    
    apiKey = project.apiKey;
    token = signAccessToken({ userId: user._id.toString(), orgId: org._id.toString(), role: 'OWNER' });
  });

  afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.disconnect();
  });

  it('should track a single event via API key', async () => {
    const res = await request(app)
      .post('/api/track')
      .set('X-Project-Key', apiKey)
      .send({
        name: 'test_event',
        userId: 'user_123',
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('tracked');
  });

  it('should get event summary using JWT auth', async () => {
    const res = await request(app)
      .get('/api/events/summary?days=7')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalEvents).toBeGreaterThan(0);
  });

  it('should get funnel analysis', async () => {
    const res = await request(app)
      .post('/api/events/funnel')
      .set('Authorization', `Bearer ${token}`)
      .send({
        steps: ['test_event', 'non_existent_event']
      });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].count).toBeGreaterThan(0);
    expect(res.body[1].count).toBe(0);
  });
});
