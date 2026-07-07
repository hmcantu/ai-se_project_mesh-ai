import fs from 'fs';
import path from 'path';
import type { Request, Response, NextFunction } from 'express';
// @ts-expect-error - pdf-parse-fork does not require explicit external type files
import pdf from 'pdf-parse-fork';
import { DocumentModel } from '../models/document.js';
import { Chunk } from '../models/chunk.js';
import { chunkText } from '../utils/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';

export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!req.file) {
      res.status(400).json({
        success: false,
        data: null,
        error: {
          message: 'No file uploaded. Please attach a file under the key "file".'
        }
      });
      return;
    }

    const title = req.body.title || req.file.originalname;
    const fileName = req.file.filename;

    const filePath = path.join(process.cwd(), 'uploads', fileName);
    const dataBuffer = fs.readFileSync(filePath);
    
    const parsedPdf = await pdf(dataBuffer);
    const extractedText = parsedPdf.text;

    if (!extractedText || extractedText.trim().length === 0) {
      res.status(400).json({
        success: false,
        data: null,
        error: {
          message: 'The uploaded PDF appears to be empty or contains unreadable text.'
        }
      });
      return;
    }

    const newDoc = new DocumentModel({
      title,
      fileName,
      userId,
    });
    await newDoc.save();

    const textChunks = chunkText(extractedText);

    await Promise.all(
      textChunks.map(async (text) => {
        const embedding = await createEmbedding(text);
        return Chunk.create({
          documentId: newDoc._id,
          text,
          embedding,
        });
      })
    );

    res.status(201).json({
      success: true,
      data: newDoc,
      error: null
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

    if (!userId) {
      res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Unauthorized access. Missing user identity.' }
      });
      return;
    }

    const documents = await DocumentModel.find({ userId: String(userId) });

    res.status(200).json({
      success: true,
      data: documents,
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (
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

    const document = await DocumentModel.findOne({ 
      _id: String(id), 
      userId: String(userId) 
    });

    if (!document) {
      res.status(404).json({
        success: false,
        data: null,
        error: { message: 'Document not found or access denied.' }
      });
      return;
    }

    await Chunk.deleteMany({ documentId: document._id });

    const filePath = path.join(process.cwd(), 'uploads', document.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.deleteOne();

    res.status(200).json({
      success: true,
      data: { message: 'Document and associated vectors removed successfully.' },
      error: null
    });
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try { 
    res.status(501).json({ 
      success: false, 
      data: null,
      error: { message: 'Not implemented.' } 
    }); 
  } catch (e) { 
    _next(e); 
  }
};

export const updateDocument = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try { 
    res.status(501).json({ 
      success: false, 
      data: null,
      error: { message: 'Not implemented.' } 
    }); 
  } catch (e) { 
    _next(e); 
  }
};

export const ingestDocument = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try { 
    res.status(501).json({ 
      success: false, 
      data: null,
      error: { message: 'Not implemented.' } 
    }); 
  } catch (e) { 
    _next(e); 
  }
};