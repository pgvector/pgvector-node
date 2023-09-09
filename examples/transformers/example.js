import { pipeline } from '@xenova/transformers';
import pg from 'pg';
import pgvector from 'pgvector/pg';

const client = new pg.Client({database: 'pgvector_example'});
await client.connect();

await client.query('CREATE EXTENSION IF NOT EXISTS vector');
await pgvector.registerType(client);

await client.query('DROP TABLE IF EXISTS documents');
await client.query('CREATE TABLE documents (id bigserial PRIMARY KEY, content text, embedding vector(384))');

const input = [
  'The dog is barking',
  'The cat is purring',
  'The bear is growling'
];

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

for (let [i, content] of input.entries()) {
  const output = await extractor(content, {pooling: 'mean', normalize: true});
  const embedding = Array.from(output.data);
  await client.query('INSERT INTO documents (content, embedding) VALUES ($1, $2)', [content, pgvector.toSql(embedding)]);
}

const documentId = 2;
const { rows } = await client.query('SELECT * FROM documents WHERE id != $1 ORDER BY embedding <=> (SELECT embedding FROM documents WHERE id = $1) LIMIT 5', [documentId]);
for (let row of rows) {
  console.log(row.content);
}

await client.end();
