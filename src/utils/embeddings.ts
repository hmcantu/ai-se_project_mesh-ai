import { getClient } from './openai-client.js';

const EMBEDDING_MODEL = 'BAAI/bge-en-icl'; // Standard Nebius embedding model; change to your specific required text string if designated by your platform

export const createEmbedding = async (text: string): Promise<number[]> => {
  const response = await getClient().embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  
  if (!response.data[0] || !response.data[0].embedding) {
    throw new Error('Failed to generate embedding from Nebius API');
  }
  
  return response.data[0].embedding;
};