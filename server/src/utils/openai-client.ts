import 'dotenv/config';
import OpenAI from 'openai';

// High-performance chat/generation model hosted on Nebius AI Studio
export const LLM_MODEL = 'Qwen/Qwen2.5-Coder-32B-Instruct'; 

let client: OpenAI;

export const getClient = (): OpenAI => {
  if (!client) {
    // Look up your specific key naming convention from the .env file
    const apiKey = process.env.NEBIUS_API_KEY || process.env.NEBIUS_SECRET_KEY;

    if (!apiKey) {
      throw new Error(
        'Critical Error: Missing Nebius API credential inside your root .env configuration.'
      );
    }

    client = new OpenAI({
      baseURL: 'https://api.studio.nebius.ai/v1', // Clean base path explicitly pointing to Nebius instead of OpenAI
      apiKey: apiKey,
    });
  }
  return client;
};

export const buildContext = (chunks: { text: string }[]): string => {
  if (chunks.length === 0) return 'No relevant context found.';
  return chunks.map((chunk, i) => `Chunk ${i + 1}: ${chunk.text}`).join('\n\n');
};