import express from 'express';
import { _getEmbeddings } from '../controllers/EmbeddingsController.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const embeddings = await _getEmbeddings(req.body.prompt);

  return res.status(200).send(embeddings);
});

export default router;
