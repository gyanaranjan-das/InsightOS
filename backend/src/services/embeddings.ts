import OpenAI from 'openai';
import { Embedding, IEmbedding } from '../models/Embedding';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Embedding generation error:', error);
    return [];
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

export async function findSimilar(
  orgId: string,
  vector: number[],
  limit = 3
): Promise<IEmbedding[]> {
  if (vector.length === 0) return [];

  try {
    const embeddings = await Embedding.find({ orgId }).lean();
    if (embeddings.length === 0) return [];

    const scored = embeddings
      .map((emb) => ({
        ...emb,
        similarity: cosineSimilarity(vector, emb.vector),
      }))
      .filter((e) => e.similarity > 0.7)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return scored as unknown as IEmbedding[];
  } catch (error) {
    console.error('Similarity search error:', error);
    return [];
  }
}
