import { readFileSync } from 'fs';
import path from 'path';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import client from './PgController.js';

//Load environment variables (populate process.env from .env file)
import dotenv from "dotenv";
dotenv.config();

const embeddings = new OpenAIEmbeddings();

export const run = async () => {
  const folderPath = path.resolve('./dist/public/files/');
  const fileName = folderPath + '/data.txt';
  const fileContent = readFileSync(fileName, 'utf8');

  // OpenAI recommends replacing newlines with spaces for best results
  const input = fileContent.replace(/\n/g, ' ')

  const res = await embeddings.embedQuery(input);

  const document = {
    title: 'listerine',
    content: 'listerine test',
    embeddings: `[${res.join(', ')}]`
  };

  const query = 'INSERT INTO documents (title, content, embeddings) VALUES ($1, $2, $3)';

  let result = await client.query(query, [document.title, document.content, document.embeddings]);

  return result;
};
