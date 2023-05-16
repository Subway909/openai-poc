import express from 'express';
import multer from 'multer';
import storage from '../../multerConfig.js';
import jsonController from '../controllers/JsonController.js';

const router = express.Router();

const upload = multer({ storage: storage });

router.post('/', upload.array('file'), async (req, res) => {
  const files: any = req.files;
  const name = req.body.name;

  let httpCode = 200;

  const result = await jsonController(files, name);

  if(!result.ok) {
    httpCode = 400;
  }

  return res.status(httpCode).send(result);
});

export default router;
