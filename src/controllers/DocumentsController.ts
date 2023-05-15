import { QueryResult } from 'pg';
import client from './PgController.js';

export type formatTypes = 'pdf'|'txt'|null;

const SIMILARITY_THRESHOLD = 0.78;
const MATCH_COUNT = 10;

export interface DocumentProps {
  id: number | null;
  updated_at: Date | null;
  content_text: string | '';
  format: formatTypes | null;
  document_name: string | '';
  page: number | '';
  url: string | '';
  file_name: string | '';
  original_file_name: string | '';
  batch: string | '';
  seq: number | '';
  embeddings: number[] | null;
}

export class DocumentsController {
  private props: DocumentProps;

  constructor(props: DocumentProps) {
    this.props = props;
  }

  async saveEmbedding(): Promise<QueryResult<any>> {
    const embeddingsAsString = vectorToString(this.props.embeddings);

    const query = `INSERT INTO documents (
                      content_text,
                      format,
                      document_name,
                      page,
                      url,
                      file_name,
                      original_file_name,
                      batch,
                      seq,
                      embeddings)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                   RETURNING id`;

    const result = await client.query(query, [this.props.content_text, this.props.format, this.props.document_name, this.props.page, this.props.url, this.props.file_name, this.props.original_file_name, this.props.batch, this.props.seq, embeddingsAsString]);

    return result;
  }
}

export class DocumentsControllerHelper {
  async checkDocumentNameExists(document_name: string): Promise<boolean> {
    const query = `SELECT COUNT(*) exists FROM documents WHERE document_name = $1`;

    const result = await client.query(query, [document_name]);

    if (result.rows[0].exists == 0) {
      return false;
    }

    return true;
  }

  async listDocuments(): Promise<Array<string>> {
    const query = `SELECT DISTINCT document_name FROM documents`;

    const result = await client.query(query);

    const docs = result.rows.map(x => x.document_name);

    return docs;
  }

  async getMatchingDocuments(embeddings: string, document_name: string): Promise<Array<any>> {
    const query = {
      text: `SELECT content_text from match_documents($1, $2, $3, $4);`,
      rowMode: 'array'
    };

    const result = await client.query(query, [embeddings, SIMILARITY_THRESHOLD, MATCH_COUNT, document_name])

    const docs = result.rows;

    return docs;
  }
}

export function vectorToString(vector: number[] | null): string {
  let embeddingsAsString: string | null = vector ? vector.join(',') : null;

  embeddingsAsString = '[' + embeddingsAsString + ']';

  return embeddingsAsString;
}