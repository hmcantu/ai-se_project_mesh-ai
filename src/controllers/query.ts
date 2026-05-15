import type { Request, Response } from 'express';

export const askQuestion = (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { answer: 'This is a stubbed AI answer.' }, error: null });
};