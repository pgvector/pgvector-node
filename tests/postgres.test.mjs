import assert from 'node:assert';
import test from 'node:test';
import postgres from 'postgres';
import pgvector from 'pgvector/postgres';
import { SparseVector } from 'pgvector';

test('postgres example', async () => {
  let sql = postgres({database: 'pgvector_node_test'});
  const types = await pgvector.types(sql);
  await sql.end();

  sql = postgres({database: 'pgvector_node_test', types: types, onnotice: function () { }});

  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  await sql`DROP TABLE IF EXISTS postgres_items`;
  await sql`CREATE TABLE postgres_items (id serial PRIMARY KEY, embedding vector(3), half_embedding halfvec(3), binary_embedding bit(3), sparse_embedding sparsevec(3))`;

  const newItems = [
    {embedding: [1, 1, 1], half_embedding: [1, 1, 1], binary_embedding: '000', sparse_embedding: new SparseVector([1, 1, 1])},
    {embedding: [2, 2, 2], half_embedding: [2, 2, 2], binary_embedding: '101', sparse_embedding: new SparseVector([2, 2, 2])},
    {embedding: [1, 1, 2], half_embedding: [1, 1, 2], binary_embedding: '111', sparse_embedding: new SparseVector([1, 1, 2])}
  ];
  await sql`INSERT INTO postgres_items ${ sql(newItems, 'embedding', 'half_embedding', 'binary_embedding', 'sparse_embedding') }`;

  const embedding = [1, 1, 1];
  const items = await sql`SELECT * FROM postgres_items ORDER BY embedding <-> ${ embedding } LIMIT 5`;
  assert.deepEqual(items.map(v => v.id), [1, 3, 2]);
  assert.deepEqual(items[0].embedding, [1, 1, 1]);
  assert.deepEqual(items[0].half_embedding, [1, 1, 1]);
  assert.equal(items[0].binary_embedding, '000');
  assert.deepEqual(items[0].sparse_embedding.toArray(), [1, 1, 1]);

  await sql`CREATE INDEX ON postgres_items USING hnsw (embedding vector_l2_ops)`;

  await sql.end();
});
