import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { vectorToString } from './DocumentsController.js';

export async function _getEmbeddings(text: string): Promise<string> {
  const embeddings = new OpenAIEmbeddings();
  const embeddingsResult = await embeddings.embedQuery(text);

  const embeddingsAsString = vectorToString(embeddingsResult);

  return embeddingsAsString;
}