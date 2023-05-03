import client from './PgController.js';

export type formatTypes = 'pdf'|'txt'|null;

export interface DocumentProps {
  id: number | null;
  updated_at: Date | null;
  content_text: string | '';
  format: formatTypes | null;
  page: number | '';
  url: string | '';
  file_name: string | '';
  original_file_name: string | '';
  batch: string | '';
  embeddings: number[] | null;
}

export class DocumentsController {
  private props: DocumentProps;

  constructor(props: DocumentProps) {
    this.props = props;
  }

  async saveEmbedding() {
    console.log('--------------> saveEmbedding');

    let embeddingsAsString: string | null = this.props.embeddings ? this.props.embeddings.join(",") : null;
    embeddingsAsString = '[' + embeddingsAsString + ']';

    const query = 'INSERT INTO documents (content_text, format, page, url, file_name, original_file_name, batch, embeddings) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';

    let result = await client.query(query, [this.props.content_text, this.props.format, this.props.page, this.props.url, this.props.file_name, this.props.original_file_name, this.props.batch, embeddingsAsString]);

    return result;
  }
}