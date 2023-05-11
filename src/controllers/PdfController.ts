import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { randomUUID } from 'crypto';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { DocumentsController, DocumentProps, DocumentsControllerHelper } from '../controllers/DocumentsController.js';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import path from 'path';

async function pdfController(filename: string, original_file_name: string, name: string) {
  //check if a document with the same name already exists

  const _document = new DocumentsControllerHelper();

  const exists = await _document.checkDocumentNameExists(name);

  if (exists) {
    return { ok: false, error: 'Document name already exists' };
  }

  const publicFolder = path.resolve('./dist/public/files/');

  const loader = new PDFLoader(publicFolder + '/' + filename);

  const docs = await loader.load();

  //loop each page
  if (docs.length > 0) {
    const embeddingsPromises: any[] = [];
    const batch = randomUUID();

    let order = 0;

    for (const input of docs) {
      const page = input.metadata.loc.pageNumber;
      let text = input.pageContent;

      text = text.replace(/\n/g, ' ');

      const splitter = new CharacterTextSplitter({
        separator: ' ',
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const output = await splitter.createDocuments([text]);

      // split the text of each page and loop each chunk
      for (const doc of output) {
        order++;

        const props: DocumentProps = {
          id: null,
          updated_at: null,
          content_text: doc.pageContent,
          format: 'pdf',
          document_name: name,
          page: page,
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

        console.log('----page: ' + page);

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

export default pdfController;