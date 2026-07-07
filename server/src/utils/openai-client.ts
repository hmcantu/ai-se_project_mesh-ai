import 'dotenv/config';
import OpenAI from 'openai';

export const LLM_MODEL = 'Qwen/Qwen3-32B'; 

let client: OpenAI;

export const getClient = (): OpenAI => {
  if (!client) {
    const apiKey = process.env.NEBIUS_API_KEY || process.env.NEBIUS_SECRET_KEY;

    if (!apiKey) {
      throw new Error(
        'Critical Error: Missing Nebius API credential inside your root .env configuration.'
      );
    }

    client = new OpenAI({
      baseURL: 'https://api.studio.nebius.ai/v1', 
      apiKey: apiKey.trim(),
    });
  }
  return client;
};

export const buildContext = (chunks: { text: string }[]): string => {
  if (chunks.length === 0) return 'No relevant context found.';
  return chunks.map((chunk, i) => `Chunk ${i + 1}: ${chunk.text}`).join('\n\n');
};

export const stripThinking = (text: string): string =>
  text.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();