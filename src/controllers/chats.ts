import type { Request, Response } from 'express';

export const createChat = (req: Request, res: Response): void => {
  res.status(201).json({ success: true, data: { id: 'chat_001' }, error: null });
};

export const getChats = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, data: [], error: null });
};

export const getChatById = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, data: { id: req.params.id }, error: null });
};

export const updateChat = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, data: { id: req.params.id, updated: true }, error: null });
};

export const deleteChat = (req: Request, res: Response): void => {
  res.status(204).send(); // 204 No Content
};

export const sendMessage = (req: Request, res: Response): void => {
  res.status(201).json({ success: true, data: { message: 'Reply from AI' }, error: null });
};