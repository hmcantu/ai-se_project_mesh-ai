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

    // 1. Verify that Multer successfully captured a file
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

    // 2. Resolve the staged file path and parse text out of the PDF properly
    const filePath = path.join(process.cwd(), 'uploads', fileName);
    const dataBuffer = fs.readFileSync(filePath);
    
    // Decompresses and extracts the real text cleanly from the PDF binary
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

    // 3. Create a Document record in MongoDB tracking the reference
    const newDoc = new DocumentModel({
      title,
      fileName,
      userId,
    });
    await newDoc.save();

    // 4. Break the extracted text into 500-character segments
    const textChunks = chunkText(extractedText);

    // 5. Fire async embedding requests and build sub-records concurrently
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

    // 6. Return standard envelope response
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

// Placeholders for remaining endpoints to prevent router compilation errors
// 🎯 Added '_' prefix to unused 'next' parameters to guarantee flawless TS build execution
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

export const deleteDocument = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
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