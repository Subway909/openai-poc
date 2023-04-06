/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
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
    embeddings: { type: 'vector(1536)' },
  });
};

exports.down = pgm => {
  pgm.dropTable('documents');
};
