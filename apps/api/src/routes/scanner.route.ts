import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

import authMiddleware from '../middlewares/authMiddleware';
import { Scan } from '../db/entities/Scan';
import { AppDataSource } from '../db/dataSource';

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
  
    await AppDataSource.manager.save(scan);
    return res.status(200).json({ file: file, authInfo: req.jwt });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
