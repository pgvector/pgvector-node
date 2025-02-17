// good resources
// https://opensearch.org/blog/improving-document-retrieval-with-sparse-semantic-encoders/
// https://huggingface.co/opensearch-project/opensearch-neural-sparse-encoding-v1
//
// run with
// text-embeddings-router --model-id opensearch-project/opensearch-neural-sparse-encoding-v1 --pooling splade

import pg from 'pg';
import { SparseVector } from 'pgvector';
import pgvector from 'pgvector/pg';

const client = new pg.Client({database: 'pgvector_example'});
await client.connect();

await client.query('CREATE EXTENSION IF NOT EXISTS vector');
await pgvector.registerTypes(client);

await client.query('DROP TABLE IF EXISTS documents');
await client.query('CREATE TABLE documents (id bigserial PRIMARY KEY, content text, embedding sparsevec(30522))');

async function embed(inputs) {
  const url = 'http://localhost:3000/embed_sparse';
  const data = {inputs: inputs};
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Bad status: ${response.status}`);
  }
  const json = await response.json();
  const embeddings = [];
  for (let item of json) {
    const embedding = {};
    for (let e of item) {
      embedding[e['index']] = e['value'];
    }
    embeddings.push(embedding);
  }
  return embeddings;
}

const input = [
  'The dog is barking',
  'The cat is purring',
  'The bear is growling'
];

const embeddings = await embed(input);
for (let [i, content] of input.entries()) {
  await client.query('INSERT INTO documents (content, embedding) VALUES ($1, $2)', [content, new SparseVector(embeddings[i], 30522)]);
}

const query = 'forest';
const queryEmbedding = (await embed([query]))[0];
const { rows } = await client.query('SELECT content FROM documents ORDER BY embedding <#> $1 LIMIT 5', [new SparseVector(queryEmbedding, 30522)]);
for (let row of rows) {
  console.log(row.content);
}

await client.end();
