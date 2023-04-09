/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

  pgm.sql(`CREATE EXTENSION IF NOT EXISTS vector;`)

  pgm.createTable('documents', {
    id: 'id',
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: { type: 'timestamp' },
    title: { type: 'text', notNull: true },
    content: { type: 'text' },
    embedding: { type: 'vector(1536)' },
  });

  pgm.sql(`CREATE INDEX ON documents
    using ivfflat (embedding vector_cosine_ops)
    with (lists = 100);`);
};

exports.down = pgm => {
  pgm.dropTable('documents');
};
