import OpenAI from 'openai';
import pg from 'pg';
import pgvector from 'pgvector/pg';

const client = new pg.Client({database: 'pgvector_node_test'});
await client.connect();

await client.query('CREATE EXTENSION IF NOT EXISTS vector');
await pgvector.registerType(client);

await client.query('DROP TABLE IF EXISTS articles');
await client.query('CREATE TABLE articles (id bigserial PRIMARY KEY, content text, embedding vector(1536))');

const input = [
  'The dog is barking',
  'The cat is purring',
  'The bear is growling'
];
const openai = new OpenAI();
const response = await openai.embeddings.create({input: input, model: 'text-embedding-ada-002'});
const embeddings = response.data.map((v) => v.embedding);

for (let [i, content] of input.entries()) {
  await client.query('INSERT INTO articles (content, embedding) VALUES ($1, $2)', [content, pgvector.toSql(embeddings[i])]);
}

const articleId = 2;
const { rows } = await client.query('SELECT * FROM articles WHERE id != $1 ORDER BY embedding <=> (SELECT embedding FROM articles WHERE id = $1) LIMIT 5', [articleId]);
for (let row of rows) {
  console.log(row.content);
}

await client.end();
