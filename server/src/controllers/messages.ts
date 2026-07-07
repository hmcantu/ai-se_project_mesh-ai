import type { Request, Response, NextFunction } from 'express';
import { Chat } from '../models/chat.js';
import { Message } from '../models/message.js';
import { DocumentModel } from '../models/document.js';
import { Chunk } from '../models/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';
import { getClient, LLM_MODEL, buildContext, stripThinking } from '../utils/openai-client.js'; // 👈 Added stripThinking here

export const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { question } = req.body;
    const chatId = req.params.id; // 👈 Mapped back to match your chatRoutes.ts parameter perfectly
    
    // 🎯 1. Extract and validate userId right away at the very top of the function scope
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Unauthorized access. Missing user identity.' }
      });
      return;
    }

    // 2. Validate that the question is present
    if (!question) {
      res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Question is required.' }
      });
      return;
    }

    // 3. Verify the chat exists and belongs to the logged-in user
    const chat = await Chat.findOne({ _id: String(chatId), userId: String(userId) });
    if (!chat) {
      res.status(404).json({
        success: false,
        data: null,
        error: { message: 'Chat not found.' }
      });
      return;
    }

    // 4. RAG pipeline — Fetch documents and chunks scoped to this user
    const userDocs = await DocumentModel.find({ userId: String(userId) }, '_id');
    const docIds = userDocs.map((d) => d._id);
    const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
    const chunks = chunkRecords.map((c) => ({
      id: String(c._id),
      documentId: String(c.documentId),
      text: c.text,
      embedding: c.embedding,
    }));

    // 5. Run Vector Similarity Matching
    const queryEmbedding = await createEmbedding(question);
    const ranked = rankBySimilarity(queryEmbedding, chunks, 5);
    const context = buildContext(ranked);

    // 6. Call the Nebius LLM and extract the answer string
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

    const rawAnswer = chatCompletion.choices[0]?.message?.content || 'Unable to generate an answer.';
    const answer = stripThinking(rawAnswer); // 👈 Wrapped to seamlessly clean out the <think> blocks

    // 7. Save the question as a user message linked to this chat
    const userMessage = new Message({
      chatId,
      role: 'user',
      content: question,
    });
    await userMessage.save();

    // 8. Save the answer as an assistant message linked to this chat
    const assistantMessage = new Message({
      chatId,
      role: 'assistant',
      content: answer,
    });
    await assistantMessage.save();

    // 9. Return both messages as an array with a 201 status code inside standard shape
    res.status(201).json({
      success: true,
      data: [userMessage, assistantMessage],
      error: null
    });
  } catch (error) {
    next(error);
  }
};