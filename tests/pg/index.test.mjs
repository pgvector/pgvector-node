import assert from 'node:assert';
import test from 'node:test';
import pg from 'pg';
import pgvector from 'pgvector/pg';
import { SparseVector } from 'pgvector';

test('pg example', async () => {
  const client = new pg.Client({database: 'pgvector_node_test'});
  await client.connect();

  await client.query('CREATE EXTENSION IF NOT EXISTS vector');
  await pgvector.registerTypes(client);

  await client.query('DROP TABLE IF EXISTS pg_items');
  await client.query('CREATE TABLE pg_items (id serial PRIMARY KEY, embedding vector(3), half_embedding halfvec(3), binary_embedding bit(3), sparse_embedding sparsevec(3))');

  const params = [
    pgvector.toSql([1, 1, 1]), pgvector.toSql([1, 1, 1]), '000', new SparseVector([1, 1, 1]),
    pgvector.toSql([2, 2, 2]), pgvector.toSql([2, 2, 2]), '101', new SparseVector([2, 2, 2]),
    pgvector.toSql([1, 1, 2]), pgvector.toSql([1, 1, 2]), '111', new SparseVector([1, 1, 2]),
    null, null, null, null
  ];
  await client.query('INSERT INTO pg_items (embedding, half_embedding, binary_embedding, sparse_embedding) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12), ($13, $14, $15, $16)', params);

  const { rows } = await client.query('SELECT * FROM pg_items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 1, 1])]);
  assert.deepEqual(rows.map(v => v.id), [1, 3, 2, 4]);
  assert.deepEqual(rows[0].embedding, [1, 1, 1]);
  assert.deepEqual(rows[0].half_embedding, [1, 1, 1]);
  assert.deepEqual(rows[0].binary_embedding, '000');
  assert.deepEqual(rows[0].sparse_embedding.toArray(), [1, 1, 1]);

  await client.query('CREATE INDEX ON pg_items USING hnsw (embedding vector_l2_ops)');

  await client.end();
});

test('pool', async () => {
  const pool = new pg.Pool({database: 'pgvector_node_test'});
  pool.on('connect', async function (client) {
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    await pgvector.registerType(client);
  });

  await pool.query('DROP TABLE IF EXISTS pg_items');
  await pool.query('CREATE TABLE pg_items (id serial PRIMARY KEY, embedding vector(3))');

  const params = [
    pgvector.toSql([1, 1, 1]),
    pgvector.toSql([2, 2, 2]),
    pgvector.toSql([1, 1, 2]),
    null
  ];
  await pool.query('INSERT INTO pg_items (embedding) VALUES ($1), ($2), ($3), ($4)', params);

  const { rows } = await pool.query('SELECT * FROM pg_items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 1, 1])]);
  assert.deepEqual(rows.map(v => v.id), [1, 3, 2, 4]);
  assert.deepEqual(rows[0].embedding, [1, 1, 1]);
  assert.deepEqual(rows[1].embedding, [1, 1, 2]);
  assert.deepEqual(rows[2].embedding, [2, 2, 2]);

  await pool.query('CREATE INDEX ON pg_items USING hnsw (embedding vector_l2_ops)');

  await pool.end();
});
