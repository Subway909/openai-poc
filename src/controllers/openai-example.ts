import { readFileSync } from 'fs';
import path from 'path';
import { OpenAIEmbeddings } from 'langchain/embeddings';

//Load environment variables (populate process.env from .env file)
import dotenv from "dotenv";
dotenv.config();

const embeddings = new OpenAIEmbeddings();

export const run = async () => {
  const folderPath = path.resolve('./dist/public/files/');
  const fileName = folderPath + '/listerine.txt';

  const fileContent = readFileSync(fileName, 'utf8');

  const res = await embeddings.embedQuery(fileContent);

  return res;
};
