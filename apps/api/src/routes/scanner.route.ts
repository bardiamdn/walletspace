import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai'

import authMiddleware from '../middlewares/authMiddleware';
import { Scan } from '../db/entities/Scan';
import { AppDataSource } from '../db/dataSource';

dotenv.config()

const router = Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for storing images
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fieldSize: 25 * 1024 * 1024, // Increase the field size limit to 25MB
    fileSize: 25 * 1024 * 1024, // Increase the file size limit to 25MB
  }
});

// POST endpoint to upload a single image
router.post('/scanner', authMiddleware, upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file as Express.Multer.File;

  if (!file) {
    console.log("File does not exist")
    return res.status(404).json({ success: false, message: 'file does not exist' });
  }
  console.log(file)
  try{
    const scan = AppDataSource.manager.create(Scan);
    scan.user = req.user;
    scan.field_name = file.fieldname;
    scan.original_name = file.originalname;
    scan.encoding = file.encoding;
    scan.mimetype = file.mimetype;
    scan.destination = file.destination;
    scan.file_name = file.filename;
    scan.path = file.path;
    scan.size = file.size;
    
    const client = new DocumentProcessorServiceClient({apiEndpoint: 'eu-documentai.googleapis.com'});

    // const documentAIUrl = `https://${process.env.GOOGLE_DOCUMENT_AI_LOCATION}-documentai.googleapis.com/v1/projects/${process.env.GOOGLE_DOCUMENT_AI_PROJECT_ID}/locations/${process.env.GOOGLE_DOCUMENT_AI_LOCATION}:fetchProcessorTypes`;

    const name = `projects/${process.env.GOOGLE_DOCUMENT_AI_PROJECT_ID}/locations/${process.env.GOOGLE_DOCUMENT_AI_LOCATION}/processors/${process.env.GOOGLE_DOCUMENT_AI_OCR_SCANNER_PROCESSOR_ID}`;
    const imagePath = path.resolve('./' + file.path);
    const imageFile = await fs.readFile(imagePath);
    console.log(imagePath)
    console.log(name)

    // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = Buffer.from(imageFile).toString('base64');
    const fieldMask = 'result.document.text'
    
    const documentAIRequest = {
      name,
      rawDocument: {
        content: encodedImage,
        mimeType: file.mimetype,
      },
      fieldMask: { paths: ['text'] }
    };

    const [result] = await client.processDocument(documentAIRequest);
    const { document } = result;
  
    await AppDataSource.manager.save(scan);
    return res.status(200).json({ file: file, authInfo: req.jwt, document: document });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
