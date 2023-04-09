import express from "express";
import multer from 'multer';
import storage from '../../multerConfig.js';
import { readFileSync } from 'fs';
import path from 'path';

const router = express.Router();

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
  const publicFolder = path.resolve('./dist/public/files/');

  let filename = req.file?.filename || '';

  const fileContent = readFileSync(publicFolder + '/' + filename, 'utf8');

  return res.json(fileContent);
});

export default router;
