import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';

const db = new PGlite({extensions: {vector}});

await db.query('CREATE EXTENSION IF NOT EXISTS vector');
await db.query('CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3))');
await db.query("INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]')");
await db.query('CREATE INDEX ON items USING hnsw (embedding vector_l2_ops)');

const { rows } = await db.query("SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5");
console.log(rows);
