import type { Request, Response, NextFunction } from 'express';
import { Chat } from '../models/chat.js';
import { Message } from '../models/message.js';
import { DocumentModel } from '../models/document.js';
import { Chunk } from '../models/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';
import { getClient, LLM_MODEL, buildContext } from '../utils/openai-client.js';

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { question } = req.body;
    const chatId = req.params.id;
    const userId = req.user?.userId;

    // 1. Validate that the question is present
    if (!question) {
      res.status(400).json({
        success: false,
        error: 'Question is required.',
      });
      return;
    }

    // 2. Verify the chat exists and belongs to the logged-in user
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      res.status(404).json({
        success: false,
        error: 'Chat not found.',
      });
      return;
    }

    // 3. RAG pipeline — Fetch documents and chunks scoped to this user
    const userDocs = await DocumentModel.find({ userId }, '_id');
    const docIds = userDocs.map((d) => d._id);
    const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
    
    const chunks = chunkRecords.map((c) => ({
      id: String(c._id),
      documentId: String(c.documentId),
      text: c.text,
      embedding: c.embedding,
    }));

    // 4. Run Vector Similarity Matching
    const queryEmbedding = await createEmbedding(question);
    const ranked = rankBySimilarity(queryEmbedding, chunks, 5);
    const context = buildContext(ranked);

    // 5. Call the Nebius LLM and extract the answer string
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
          content: `Document Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer = chatCompletion.choices[0]?.message?.content || 'Unable to generate an answer.';

    // 6. Save the question as a user message linked to this chat
    const userMessage = new Message({
      chatId,
      role: 'user',
      content: question,
    });
    await userMessage.save();

    // 7. Save the answer as an assistant message linked to this chat
    const assistantMessage = new Message({
      chatId,
      role: 'assistant',
      content: answer,
    });
    await assistantMessage.save();

    // 8. Return both messages as an array with a 201 status code inside standard shape
    res.status(201).json({
      success: true,
      data: [userMessage, assistantMessage],
    });
  } catch (error) {
    next(error);
  }
};