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

const upload = multer({ storage: storage });

// POST endpoint to upload a single image
router.post('/scanner', authMiddleware, upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file as Express.Multer.File;

  if (!file) {
    const error = new Error('Please upload a file') as any;
    error.httpStatusCode = 400;
    return next(error);
  }

  try{
    const scan = AppDataSource.manager.create(Scan);;
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
    console.log("Scan: ", scan)

    console.log("New Image File:", file)
    return res.status(200).send(file); // Send response with file details
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
