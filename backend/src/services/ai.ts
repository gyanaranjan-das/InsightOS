import OpenAI from 'openai';
import { Event } from '../models/Event';
import { Project } from '../models/Project';
import { AIQuery } from '../models/AIQuery';
import { Embedding } from '../models/Embedding';
import { generateEmbedding, findSimilar } from './embeddings';
import mongoose from 'mongoose';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AIResult {
  insight: string;
  recommendations: string[];
  confidence: number;
  dataPoints: { label: string; value: number }[];
}

async function getOrgContext(orgId: string): Promise<string> {
  const projects = await Project.find({ orgId }).select('_id');
  const projectIds = projects.map((p) => new mongoose.Types.ObjectId(p._id.toString()));

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalEvents, uniqueUsers, topEventsPipeline] = await Promise.all([
    Event.countDocuments({ projectId: { $in: projectIds }, timestamp: { $gte: thirtyDaysAgo } }),
    Event.distinct('userId', { projectId: { $in: projectIds }, timestamp: { $gte: thirtyDaysAgo }, userId: { $ne: null } }),
    Event.aggregate([
      { $match: { projectId: { $in: projectIds }, timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $sort: { count: -1 as const } },
      { $limit: 10 },
    ]),
  ]);

  const topEventsStr = topEventsPipeline
    .map((e) => `${e._id}: ${e.count}`)
    .join(', ');

  return `Organization Context (last 30 days):
- Total Events: ${totalEvents}
- Unique Users: ${uniqueUsers.length}
- Top Events: ${topEventsStr}
- Database: MongoDB with collections for Events, Users, Projects, Dashboards
- Event schema: name (string), properties (JSON), userId, sessionId, timestamp`;
}

export async function queryAI(
  question: string,
  orgId: string,
  userId: string
): Promise<AIResult> {
  try {
    /* ── Step 1: Generate embedding ─────────────────────── */
    const questionEmbedding = await generateEmbedding(question);

    /* ── Step 2: Find similar past queries ──────────────── */
    const similarQueries = await findSimilar(orgId, questionEmbedding, 3);
    const similarContext = similarQueries.length > 0
      ? `\nSimilar past queries:\n${similarQueries.map((q) => `Q: ${q.content}\nA: ${JSON.stringify(q.metadata)}`).join('\n')}`
      : '';

    /* ── Step 3: Build context ──────────────────────────── */
    const orgContext = await getOrgContext(orgId);

    /* ── Step 4: Call GPT-4o ────────────────────────────── */
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are InsightOS, an AI analytics assistant. Analyze the user's SaaS analytics data and provide actionable insights.

${orgContext}
${similarContext}

RESPOND ONLY IN THIS EXACT JSON FORMAT:
{
  "insight": "A clear, concise insight about the data",
  "recommendations": ["Action item 1", "Action item 2", "Action item 3"],
  "confidence": 0.85,
  "dataPoints": [{"label": "Category", "value": 42}]
}

Rules:
- confidence is 0-1 based on data quality and certainty
- dataPoints should contain relevant metrics that support your insight
- recommendations should be specific and actionable
- If you don't have enough data, say so and set confidence low`,
        },
        { role: 'user', content: question },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    /* ── Step 5: Parse response ─────────────────────────── */
    const content = completion.choices[0]?.message?.content || '{}';
    let result: AIResult;

    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        insight: content,
        recommendations: ['Review the raw response for detailed insights'],
        confidence: 0.5,
        dataPoints: [],
      };
    }

    /* ── Step 6: Save query + embedding ─────────────────── */
    await AIQuery.create({
      orgId,
      userId,
      question,
      result,
    });

    if (questionEmbedding.length > 0) {
      await Embedding.create({
        orgId,
        content: question,
        vector: questionEmbedding,
        metadata: { insight: result.insight },
      });
    }

    return result;
  } catch (error) {
    console.error('AI service error:', error);

    return {
      insight: 'Unable to process your query at this time. Please check your OpenAI API key configuration.',
      recommendations: ['Verify OPENAI_API_KEY is set correctly', 'Check API usage limits', 'Try again in a few moments'],
      confidence: 0,
      dataPoints: [],
    };
  }
}
