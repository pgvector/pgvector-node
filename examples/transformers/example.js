import { pipeline } from '@huggingface/transformers';
import pg from 'pg';
import pgvector from 'pgvector/pg';

const client = new pg.Client({database: 'pgvector_example'});
await client.connect();

await client.query('CREATE EXTENSION IF NOT EXISTS vector');
await pgvector.registerTypes(client);

await client.query('DROP TABLE IF EXISTS documents');
await client.query('CREATE TABLE documents (id bigserial PRIMARY KEY, content text, embedding vector(384))');

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {dtype: 'fp32'});

async function embed(input) {
  const output = await extractor(input, {pooling: 'mean', normalize: true});
  return output.tolist();
}

const input = [
  'The dog is barking',
  'The cat is purring',
  'The bear is growling'
];
const embeddings = await embed(input);
for (let [i, content] of input.entries()) {
  await client.query('INSERT INTO documents (content, embedding) VALUES ($1, $2)', [content, pgvector.toSql(embeddings[i])]);
}

const query = 'forest';
const queryEmbedding = (await embed([query]))[0];
const { rows } = await client.query('SELECT content FROM documents ORDER BY embedding <=> $1 LIMIT 5', [pgvector.toSql(queryEmbedding)]);
for (let row of rows) {
  console.log(row.content);
}

await client.end();
