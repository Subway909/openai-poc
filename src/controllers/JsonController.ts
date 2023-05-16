import path from 'path';
import fs from 'fs';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { DocumentProps, DocumentsController } from '../controllers/DocumentsController.js';
import { randomUUID } from 'crypto';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

async function jsonController(files: any, name: string) {
  const publicFolder = path.resolve('./dist/public/files/');
  const batch = randomUUID();
  const embeddingsPromises: any[] = [];

  const splitter = new CharacterTextSplitter({
    separator: ' ',
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  if(files.length > 0) {
    //loop each file
    for (const file of files) {
      let order = 0;
      const filename = file.filename;
      const original_file_name = file.originalname;

      const buffer = fs.readFileSync(publicFolder + '/' + filename);
      const fileContent: iFileContent = JSON.parse(buffer.toString());
      let text = fileContent.body;

      text = text.replace(/\n/g, ' ');

      const output = await splitter.createDocuments([text]);

      let chunk = 1;

      // split the text of each page and loop each chunk
      for (const doc of output) {
        order++;
        chunk++;

        const props: DocumentProps = {
          id: null,
          updated_at: null,
          content_text: doc.pageContent,
          format: 'json',
          document_name: name,
          page: 0,
          url: '',
          file_name: filename,
          original_file_name: original_file_name,
          batch: batch,
          seq: order,
          embeddings: null,
        }

        const embeddings = new OpenAIEmbeddings();
        const embeddingsResult = await embeddings.embedQuery(doc.pageContent);
        props.embeddings = embeddingsResult;

        console.log(`Importing file: ${original_file_name} Chunk: #${chunk}`)

        const newDocument = new DocumentsController(props);
        newDocument.saveEmbedding();
        embeddingsPromises.push(props);
      }
    }

    const embeddingsResults = await Promise.all(embeddingsPromises);

    return { ok: true, embeddings: embeddingsResults };
  }
  else {
    return { ok: false, error: 'No documents found' };
  }
}

interface iFileContent {
  body: string;
  description: string;
  title: string;
}

export default jsonController;