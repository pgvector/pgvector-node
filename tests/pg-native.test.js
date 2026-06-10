import assert from 'node:assert';
import test from 'node:test';
import pgvector from 'pgvector/pg';
import { SparseVector } from 'pgvector';

function isDeno() {
  // @ts-ignore
  return typeof Deno !== 'undefined';
}

test('pg-native example', {skip: isDeno()}, async () => {
  // @ts-ignore
  const { default: Client } = await import('pg-native');

  const client = new Client();
  client.connectSync('postgres://localhost/pgvector_node_test');

  client.querySync('CREATE EXTENSION IF NOT EXISTS vector');
  client.querySync('DROP TABLE IF EXISTS pg_native_items');
  client.querySync('CREATE TABLE pg_native_items (id serial PRIMARY KEY, embedding vector(3), half_embedding halfvec(3), binary_embedding bit(3), sparse_embedding sparsevec(3))');

  const params = [
    pgvector.toSql([1, 1, 1]), pgvector.toSql([1, 1, 1]), '000', new SparseVector([1, 1, 1]),
    pgvector.toSql([2, 2, 2]), pgvector.toSql([2, 2, 2]), '101', new SparseVector([2, 2, 2]),
    pgvector.toSql([1, 1, 2]), pgvector.toSql([1, 1, 2]), '111', new SparseVector([1, 1, 2]),
    null, null, null, null
  ];
  client.querySync('INSERT INTO pg_native_items (embedding, half_embedding, binary_embedding, sparse_embedding) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12), ($13, $14, $15, $16)', params);

  const rows = client.querySync('SELECT * FROM pg_native_items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 1, 1])]);
  assert.deepEqual(rows.map(/** @type {function(any): number} */ v => v.id), [1, 3, 2, 4]);
  assert.deepEqual(pgvector.fromSql(rows[0].embedding), [1, 1, 1]);
  assert.deepEqual(pgvector.fromSql(rows[0].half_embedding), [1, 1, 1]);
  assert.deepEqual(rows[0].binary_embedding, '000');
  assert.deepEqual(pgvector.fromSql(rows[0].sparse_embedding), new SparseVector([1, 1, 1]));

  client.querySync('CREATE INDEX ON pg_native_items USING hnsw (embedding vector_l2_ops)');

  client.end();
});
