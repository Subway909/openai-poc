import express from "express";
import multer from 'multer';
import storage from '../../multerConfig.js';
import pdfController from '../controllers/PdfController.js';

const router = express.Router();

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
  const filename = req.file?.filename || '';
  const original_file_name = req.file?.originalname || '';
  const name = req.body.name || '';

  let httpCode = 200;

  const result = await pdfController(filename, original_file_name, name);

  if(!result.ok) {
    httpCode = 400;
  }

  return res.status(httpCode).send(result);
});

export default router;