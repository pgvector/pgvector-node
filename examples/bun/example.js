import { SQL } from 'bun';
import pgvector from 'pgvector';

const sql = new SQL({database: 'pgvector_example'});

await sql`CREATE EXTENSION IF NOT EXISTS vector`;
await sql`DROP TABLE IF EXISTS items`;
await sql`CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3))`;

const item = {
  embedding: pgvector.toSql([1, 2, 3])
};
await sql`INSERT INTO items (embedding) ${sql(item)}`;

const items = [
  {embedding: pgvector.toSql([4, 5, 6])},
  {embedding: pgvector.toSql([7, 8, 9])}
];
await sql`INSERT INTO items (embedding) ${sql(items)}`;

await sql`CREATE INDEX ON items USING hnsw (embedding vector_l2_ops)`;

const rows = await sql`SELECT * FROM items ORDER BY embedding <-> ${item.embedding} LIMIT 5`.values();
console.log(rows);
