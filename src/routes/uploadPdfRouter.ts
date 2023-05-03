import express from "express";
import multer from 'multer';
import storage from '../../multerConfig.js';
import path from 'path';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { DocumentsController, DocumentProps } from '../controllers/documentsController.js';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { randomUUID } from 'crypto';

const router = express.Router();

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
  const publicFolder = path.resolve('./dist/public/files/');

  let filename = req.file?.filename || '';

  const loader = new PDFLoader(publicFolder + '/' + filename);

  const docs = await loader.load();

  //loop each page
  if (docs.length > 0) {
    const embeddingsPromises: any[] = [];
    const batch = randomUUID();

    for (const input of docs) {
      let page = input.metadata.loc.pageNumber;
      const text = input.pageContent;

      const splitter = new CharacterTextSplitter({
        separator: "\n",
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const output = await splitter.createDocuments([text]);

      // split the text of each page and loop each chunk
      for (const doc of output) {
        let props: DocumentProps = {
          id: null,
          updated_at: null,
          content_text: doc.pageContent,
          format: 'pdf',
          page: page,
          url: '',
          file_name: filename,
          original_file_name: req.file?.originalname || '',
          batch: batch,
          embeddings: null,
        }

        let embeddings = new OpenAIEmbeddings();

        const res = await embeddings.embedQuery(doc.pageContent);

        props.embeddings = res;

        console.log('----page: ' + page);

        let newDocument = new DocumentsController(props);

        let result = newDocument.saveEmbedding();

        embeddingsPromises.push(props);
      }
    }

    const embeddingsResults = await Promise.all(embeddingsPromises);

    return res.status(200).send({ ok: true, embeddings: embeddingsResults });
  }
  else {
    return res.status(400).send({ error: 'No documents found' });
  }
});

export default router;
