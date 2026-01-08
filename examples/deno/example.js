import { Client } from 'jsr:@db/postgres';
import pgvector from 'npm:pgvector';

const client = new Client({database: 'pgvector_example', hostname: 'localhost', user: Deno.env.get('USER'), tls: {enabled: false}});
await client.connect();

await client.queryArray`CREATE EXTENSION IF NOT EXISTS vector`;
await client.queryArray`DROP TABLE IF EXISTS items`;
await client.queryArray`CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3))`;

const embedding = pgvector.toSql([1, 2, 3]);
const embedding2 = pgvector.toSql([4, 5, 6]);
await client.queryArray`INSERT INTO items (embedding) VALUES (${embedding}), (${embedding2})`;

await client.queryArray`CREATE INDEX ON items USING hnsw (embedding vector_l2_ops)`;

const { rows } = await client.queryArray`SELECT * FROM items ORDER BY embedding <-> ${embedding} LIMIT 5`;
console.log(rows);

await client.end();
