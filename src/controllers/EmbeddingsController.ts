import { OpenAIEmbeddings } from 'langchain/embeddings';
import { vectorToString } from './DocumentsController.js';

export async function getEmbeddings(text: string): Promise<string> {
  const embeddings = new OpenAIEmbeddings();
  const embeddingsResult = await embeddings.embedQuery(text);

  const embeddingsAsString = vectorToString(embeddingsResult);

  return embeddingsAsString;
}