import request from 'supertest';
import { app } from '../src/index';
import { User } from '../src/models/User';
import { Organization } from '../src/models/Organization';
import mongoose from 'mongoose';

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insightos_test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Organization.deleteMany({});
    await mongoose.disconnect();
  });

  let tokens = { accessToken: '', refreshToken: '' };

  it('should register a new user and organization', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      orgName: 'Test Org'
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should login an existing user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    
    tokens.accessToken = res.body.accessToken;
    tokens.refreshToken = res.body.refreshToken;
  });

  it('should refresh the access token', async () => {
    const res = await request(app).post('/api/auth/refresh').send({
      refreshToken: tokens.refreshToken,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should logout the user', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');
  });
});
