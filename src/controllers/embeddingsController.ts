class DocumentController {
  id: number;
  title: string;
  content: string;
  embeddings: string;

  constructor(id: number, title: string, content: string, embeddings: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.embeddings = embeddings;
  }

  createEmbedding() {
    console.log('createEmbedding');
  }

  // TODO - read file
  // TODO - get embedding from openai
  // TODO - save embedding to db
  // TODO - search embeddings on db

}

let doc = new DocumentController(1, 'test', 'test', 'test');

doc.createEmbedding();