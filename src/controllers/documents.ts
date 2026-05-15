import type { Request, Response } from 'express';

export const uploadDocument = (req: Request, res: Response) => {
  res.status(201).json({ success: true, data: { id: 'doc_001' }, error: null });
};

export const getDocuments = (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: [], error: null });
};

export const deleteDocument = (req: Request, res: Response) => {
  res.status(204).send();
};