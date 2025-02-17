import { pipeline } from '@huggingface/transformers';
import pg from 'pg';
import pgvector from 'pgvector/pg';

const client = new pg.Client({database: 'pgvector_example'});
await client.connect();

await client.query('CREATE EXTENSION IF NOT EXISTS vector');
await pgvector.registerTypes(client);

await client.query('DROP TABLE IF EXISTS documents');
await client.query('CREATE TABLE documents (id bigserial PRIMARY KEY, content text, embedding vector(384))');
await client.query("CREATE INDEX ON documents USING GIN (to_tsvector('english', content))");

const input = [
  'The dog is barking',
  'The cat is purring',
  'The bear is growling'
];

const extractor = await pipeline('feature-extraction', 'Xenova/multi-qa-MiniLM-L6-cos-v1', {dtype: 'fp32'});

async function embed(content) {
  const output = await extractor(content, {pooling: 'mean', normalize: true});
  return Array.from(output.data);
}

for (let content of input) {
  const embedding = await embed(content);
  await client.query('INSERT INTO documents (content, embedding) VALUES ($1, $2)', [content, pgvector.toSql(embedding)]);
}

const sql = `
WITH semantic_search AS (
    SELECT id, RANK () OVER (ORDER BY embedding <=> $2) AS rank
    FROM documents
    ORDER BY embedding <=> $2
    LIMIT 20
),
keyword_search AS (
    SELECT id, RANK () OVER (ORDER BY ts_rank_cd(to_tsvector('english', content), query) DESC)
    FROM documents, plainto_tsquery('english', $1) query
    WHERE to_tsvector('english', content) @@ query
    ORDER BY ts_rank_cd(to_tsvector('english', content), query) DESC
    LIMIT 20
)
SELECT
    COALESCE(semantic_search.id, keyword_search.id) AS id,
    COALESCE(1.0 / ($3 + semantic_search.rank), 0.0) +
    COALESCE(1.0 / ($3 + keyword_search.rank), 0.0) AS score
FROM semantic_search
FULL OUTER JOIN keyword_search ON semantic_search.id = keyword_search.id
ORDER BY score DESC
LIMIT 5
`;
const query = 'growling bear'
const embedding = await embed(query);
const k = 60
const { rows } = await client.query(sql, [query, pgvector.toSql(embedding), k]);
for (let row of rows) {
  console.log(row);
}

await client.end();
