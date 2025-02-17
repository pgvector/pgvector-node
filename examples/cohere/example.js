import { CohereClient } from 'cohere-ai';
import pg from 'pg';
import pgvector from 'pgvector/pg';

const client = new pg.Client({database: 'pgvector_example'});
await client.connect();

await client.query('CREATE EXTENSION IF NOT EXISTS vector');
await pgvector.registerTypes(client);

await client.query('DROP TABLE IF EXISTS documents');
await client.query('CREATE TABLE documents (id bigserial PRIMARY KEY, content text, embedding bit(1024))');

async function embed(texts, inputType) {
  const cohere = new CohereClient();
  const response = await cohere.embed({
    texts: texts,
    model: 'embed-english-v3.0',
    inputType: inputType,
    embeddingTypes: ['ubinary']
  });
  return response.embeddings.ubinary.map((e) => {
    return e.map((v) => v.toString(2).padStart(8, '0')).join('')
  });
}

const input = [
  'The dog is barking',
  'The cat is purring',
  'The bear is growling'
];
const embeddings = await embed(input, 'search_document');
for (let [i, content] of input.entries()) {
  await client.query('INSERT INTO documents (content, embedding) VALUES ($1, $2)', [content, embeddings[i]]);
}

const query = 'forest';
const queryEmbedding = (await embed([query], 'search_query'))[0];
const { rows } = await client.query('SELECT content FROM documents ORDER BY embedding <~> $1 LIMIT 5', [queryEmbedding]);
for (let row of rows) {
  console.log(row.content);
}

await client.end();
