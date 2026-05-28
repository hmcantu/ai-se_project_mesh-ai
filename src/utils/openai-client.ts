import OpenAI from 'openai';

export const LLM_MODEL = 'Qwen/Qwen2.5-Coder-32B-Instruct'; // Updated to a standard valid Nebius model identifier if needed, or keep your exact string
let client: OpenAI;

export const getClient = (): OpenAI => {
  if (!client) {
    client = new OpenAI({
      baseURL: 'https://api.studio.nebius.ai/v1/', // Direct endpoint base URL for Nebius AI Studio
      apiKey: process.env.NEBIUS_API_KEY!,
    });
  }
  return client;
};

export const buildContext = (chunks: { text: string }[]): string => {
  if (chunks.length === 0) return 'No relevant context found.';
  return chunks.map((chunk, i) => `Chunk ${i + 1}: ${chunk.text}`).join('\n\n');
};