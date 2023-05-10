import express from "express";
import { OpenAIEmbeddings } from 'langchain/embeddings';

const router = express.Router();

router.post('/', async (req, res) => {
  const prompt = req.body.prompt;
  let embeddings = new OpenAIEmbeddings();
  let embeddingsResult = await embeddings.embedQuery(prompt);

  let embeddingsAsString: string | null = embeddingsResult ? embeddingsResult.join(",") : null;
    embeddingsAsString = '[' + embeddingsAsString + ']';

  return res.status(200).send(embeddingsAsString);
});

export default router;

