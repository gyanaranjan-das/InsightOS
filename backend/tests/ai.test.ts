import request from 'supertest';
import { app } from '../src/index';
import { Organization } from '../src/models/Organization';
import { User } from '../src/models/User';
import mongoose from 'mongoose';
import { signAccessToken } from '../src/utils/jwt';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    embeddings: {
      create: jest.fn().mockResolvedValue({
        data: [{ embedding: new Array(1536).fill(0.1) }],
      }),
    },
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  insight: 'Mocked insight text.',
                  recommendations: ['Do this', 'Do that'],
                  confidence: 0.95,
                  dataPoints: [{ label: 'Users', value: 100 }],
                }),
              },
            },
          ],
        }),
      },
    },
  }));
});

describe('AI API', () => {
  let token = '';

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insightos_test');
    const org = await Organization.create({ name: 'AI Test Org', slug: 'ai-test' });
    const user = await User.create({ email: 'ai@test.com', passwordHash: 'hash', name: 'Tester', role: 'OWNER', orgId: org._id });
    token = signAccessToken({ userId: user._id.toString(), orgId: org._id.toString(), role: 'OWNER' });
  });

  afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.disconnect();
  });

  it('should query AI and return structured insight', async () => {
    const res = await request(app)
      .post('/api/ai/query')
      .set('Authorization', `Bearer ${token}`)
      .send({
        question: 'Why did churn increase?'
      });

    expect(res.status).toBe(200);
    expect(res.body.insight).toBe('Mocked insight text.');
    expect(res.body.recommendations.length).toBe(2);
    expect(res.body.confidence).toBe(0.95);
  });
});
