import 'dotenv/config';

const EMBEDDING_MODEL = 'Qwen/Qwen3-Embedding-8B';

export const createEmbedding = async (text: string): Promise<number[]> => {
  const apiKey = process.env.NEBIUS_API_KEY;

  if (!apiKey) {
    throw new Error('Critical Error: NEBIUS_API_KEY is completely missing from process.env inside embeddings.ts');
  }

  // 🎯 Bypassing the OpenAI SDK entirely to communicate directly with Nebius endpoints
  const response = await fetch('https://api.studio.nebius.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Nebius API Error (Status ${response.status}): ${errorText || 'No error body returned'}`);
  }

  const json = (await response.json()) as any;
  
  if (!json.data?.[0]?.embedding) {
    throw new Error('Failed to find embedding vector inside Nebius API response JSON payload');
  }

  return json.data[0].embedding;
};