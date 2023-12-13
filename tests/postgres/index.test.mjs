import postgres from 'postgres';
import { vector } from 'pgvector';

test('example', async () => {
  const sql = postgres({database: 'pgvector_node_test', onnotice: function() {}});

  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  await sql`DROP TABLE IF EXISTS postgres_items`;
  await sql`CREATE TABLE postgres_items (id serial PRIMARY KEY, embedding vector(3))`;

  const newItems = [
    {embedding: vector([1, 1, 1])},
    {embedding: vector([2, 2, 2])},
    {embedding: vector([1, 1, 2])}
  ];
  await sql`INSERT INTO postgres_items ${ sql(newItems, 'embedding') }`;

  const embedding = vector([1, 1, 1]);
  const items = await sql`SELECT * FROM postgres_items ORDER BY embedding <-> ${ embedding } LIMIT 5`;
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2]);
  expect(vector(items[0].embedding).toArray()).toStrictEqual([1, 1, 1]);
  expect(vector(items[1].embedding).toArray()).toStrictEqual([1, 1, 2]);
  expect(vector(items[2].embedding).toArray()).toStrictEqual([2, 2, 2]);

  await sql`CREATE INDEX ON postgres_items USING hnsw (embedding vector_l2_ops)`;

  await sql.end();
});
