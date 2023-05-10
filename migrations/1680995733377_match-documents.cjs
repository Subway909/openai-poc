/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`CREATE OR REPLACE FUNCTION match_documents (
    query_embedding vector(1536),
    match_threshold float,
    match_count int,
    doc_name text
  )
  RETURNS TABLE (
    id int,
    similarity float,
    content_text text,
    seq int
  )
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN query
    SELECT
      documents.id,
      1 - (documents.embeddings <=> query_embedding) AS similarity,
      documents.content_text,
      documents.seq
    FROM DOCUMENTS
    WHERE 1 - (documents.embeddings <=> query_embedding) > match_threshold
    AND documents.document_name = doc_name
    ORDER BY similarity desc
    LIMIT match_count;
  END;
  $$;`);
};

exports.down = pgm => {
  pgm.sql(`DROP FUNCTION IF EXISTS match_documents;`);
};