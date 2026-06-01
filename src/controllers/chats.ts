import { type Request, type Response, type NextFunction } from 'express';
import { Chat } from '../models/chat.js';
import { Message } from '../models/message.js';

export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title } = req.body;
    const userId = req.user?.userId;

    if (!title) {
      res.status(400).json({
        success: false,
        data: null,
        error: { message: 'Chat title is required.' }
      });
      return;
    }

    const newChat = new Chat({
      title,
      userId,
    });
    await newChat.save();

    res.status(201).json({
      success: true,
      data: newChat,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Unauthorized access. Missing user identity.' }
      });
      return;
    }

    const chats = await Chat.find({ userId: String(userId) });

    res.status(200).json({
      success: true,
      data: chats,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getChatById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Unauthorized access. Missing user identity.' }
      });
      return;
    }

    const chat = await Chat.findOne({ _id: String(id), userId: String(userId) });

    if (!chat) {
      res.status(404).json({
        success: false,
        data: null,
        error: { message: 'Chat not found.' }
      });
      return;
    }

    const messages = await Message.find({ chatId: String(id) }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        chat,
        messages,
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const updateChat = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try { 
    res.status(501).json({ 
      success: false, 
      data: null,
      error: { message: 'Not implemented yet.' } 
    }); 
  } catch (e) { 
    _next(e); 
  }
};

export const deleteChat = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try { 
    res.status(501).json({ 
      success: false, 
      data: null,
      error: { message: 'Not implemented yet.' } 
    }); 
  } catch (e) { 
    _next(e); 
  }
};

export const sendMessage = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try { 
    res.status(501).json({ 
      success: false, 
      data: null,
      error: { message: 'Not implemented yet.' } 
    }); 
  } catch (e) { 
    _next(e); 
  }
};