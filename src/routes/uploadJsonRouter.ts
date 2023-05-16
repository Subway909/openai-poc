import express from 'express';
import multer from 'multer';
import storage from '../../multerConfig.js';
//import jsonController from '../controllers/JsonController.js';
import path from 'path';
import fs from 'fs';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { DocumentProps, DocumentsController } from '../controllers/DocumentsController.js';
import { randomUUID } from 'crypto';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

const router = express.Router();

const upload = multer({ storage: storage });

router.post('/', upload.array('file'), async (req, res) => {
  const files: any = req.files;
  const publicFolder = path.resolve('./dist/public/files/');
  const name = req.body.name;
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

      // split the text of each page and loop each chunk
      for (const doc of output) {
        order++;

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

        const newDocument = new DocumentsController(props);

        newDocument.saveEmbedding();

        embeddingsPromises.push(props);
      }
    }

    const embeddingsResults = await Promise.all(embeddingsPromises);

    res.status(200).json({ ok: true, embeddings: embeddingsResults });
  }
  else {
    res.status(400).json({ ok: false, error: 'No documents found' });
  }
});

interface iFileContent {
  body: string;
  description: string;
  title: string;
}

export default router;
