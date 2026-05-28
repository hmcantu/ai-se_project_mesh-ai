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
        error: 'Chat title is required.',
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

    const chats = await Chat.find({ userId });

    res.status(200).json({
      success: true,
      data: chats,
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

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      res.status(404).json({
        success: false,
        error: 'Chat not found.',
      });
      return;
    }

    const messages = await Message.find({ chatId: id }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        chat,
        messages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Placeholders for updateChat, deleteChat, and sendMessage to prevent router breakage
export const updateChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(501).json({ success: false, error: 'Not implemented yet.' }); } catch (e) { next(e); }
};

export const deleteChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(501).json({ success: false, error: 'Not implemented yet.' }); } catch (e) { next(e); }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(501).json({ success: false, error: 'Not implemented yet.' }); } catch (e) { next(e); }
};