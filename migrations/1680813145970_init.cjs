/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

  pgm.sql(`CREATE EXTENSION IF NOT EXISTS vector;`)

  pgm.createTable('documents', {
    id: 'id',
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: { type: 'timestamp' },
    content_text: { type: 'text' },
    format: { type: 'text', check: "format in ('text', 'pdf', null)"},
    document_name: { type: 'text' },
    page: {type: 'text'},
    url: {type: 'text' },
    file_name: { type: 'text' },
    original_file_name: { type: 'text' },
    batch: { type: 'text' },
    seq: { type: 'integer' },
    embeddings: { type: 'vector(1536)' },
  });

  pgm.sql(`CREATE INDEX ON documents
    using ivfflat (embeddings vector_cosine_ops)
    with (lists = 100);`);
};

exports.down = pgm => {
  pgm.dropTable('documents');
};
