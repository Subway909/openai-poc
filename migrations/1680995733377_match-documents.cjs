/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`CREATE OR REPLACE FUNCTION match_documents (
    query_embedding vector(1536),
    similarity_threshold float,
    match_count int
  )
  RETURNS TABLE (
    id bigint,
    content text,
    similarity float
  )
  LANGUAGE plpgsql
  AS $$
  #variable_conflict use_variable
  BEGIN
    RETURN query
    SELECT
      id,
      content,
      1 - (documents.embedding <=> query_embedding) AS similarity
    FROM DOCUMENTS
    WHERE 1 - (documents.embedding <=> query_embedding) > similarity_threshold
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
  END;
  $$;`);
};

exports.down = pgm => {
  pgm.sql(`DROP FUNCTION IF EXISTS match_documents;`);
};
