import express from 'express';
import { PromptController } from '../controllers/PromptController.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const promptText = req.body.prompt;
  const document_name = req.body.document_name;
  const Prompt = new PromptController();
  try {
    const result = await Prompt.run(promptText, document_name);
    return res.status(200).send(result);
  }
  catch (err: any) {
    const result = err.message;
    return res.status(400).json({error: result});
  }
});

export default router;