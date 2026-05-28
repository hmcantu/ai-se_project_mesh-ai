import { type Request, type Response, type NextFunction } from 'express';
import { DocumentModel } from '../models/document.js';

export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // 1. Verify that Multer successfully captured a file
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded. Please attach a file under the key "file".',
      });
      return;
    }

    // 2. Extract original name or use the randomized disk filename
    const title = req.body.title || req.file.originalname;
    const fileName = req.file.filename;

    // 3. Create a Document record in MongoDB tracking the reference
    const newDoc = new DocumentModel({
      title,
      fileName,
      userId,
    });
    await newDoc.save();

    // 4. Return standard envelope response
    res.status(201).json({
      success: true,
      data: newDoc,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Find all documents scoped exclusively to the logged-in user
    const documents = await DocumentModel.find({ userId });

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

// Placeholders for remaining endpoints to prevent router compilation errors
export const getDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(501).json({ success: false, error: 'Not implemented.' }); } catch (e) { next(e); }
};

export const updateDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(501).json({ success: false, error: 'Not implemented.' }); } catch (e) { next(e); }
};

export const deleteDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(501).json({ success: false, error: 'Not implemented.' }); } catch (e) { next(e); }
};

export const ingestDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(501).json({ success: false, error: 'Not implemented.' }); } catch (e) { next(e); }
};