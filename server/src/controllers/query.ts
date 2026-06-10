import type { Request, Response, NextFunction } from 'express';
import { DocumentModel } from '../models/document.js';
import { Chunk } from '../models/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';
import { getClient, LLM_MODEL, buildContext } from '../utils/openai-client.js';

export const askQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { question } = req.body;

    // 1. Validate presence of the question string
    if (!question) {
      res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Question is required.' }
      });
      return;
    }

    // 2. Resolve the current logged-in User's ID
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Unauthorized access. Missing user identity.' }
      });
      return;
    }

    // 3. Find only documents belonging to this user using a high-efficiency ID projection
    // 🎯 2. Wrap parameter inside String() to satisfy exactOptionalPropertyTypes
    const userDocs = await DocumentModel.find({ userId: String(userId) }, '_id');
    const docIds = userDocs.map((doc) => doc._id);

    // 4. Extract all text chunks belonging exclusively to those document IDs
    const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
    
    const chunks = chunkRecords.map((c) => ({
      id: String(c._id),
      documentId: String(c.documentId),
      text: c.text,
      embedding: c.embedding,
    }));

    // 5. Calculate vector embedding for the incoming question string
    const queryEmbedding = await createEmbedding(question);

    // 6. Perform similarity search math to rank and filter down to the top 5 most relevant blocks
    const topChunks = rankBySimilarity(queryEmbedding, chunks, 5);

    // 7. Compile those raw text blocks into a single structured string prompt context
    const contextText = buildContext(topChunks);

    // 8. Ship the context along with the user's question to the Nebius LLM
    const openai = getClient();
    const chatCompletion = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Answer the user\'s question accurately using only the provided document context below.',
        },
        {
          role: 'user',
          content: `Document Context:\n${contextText}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = chatCompletion.choices[0]?.message?.content || 'Unable to generate an answer.';

    // 9. Return response wrapped inside the required standard structure
    res.status(200).json({
      success: true,
      data: {
        answer,
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};