import assert from 'node:assert';
import test from 'node:test';
import pgvector from 'pgvector';
import { SparseVector } from 'pgvector';
import { createPool, sql } from 'slonik';

test('example', async () => {
  const pool = await createPool('postgres://localhost/pgvector_node_test');

  await pool.query(sql.unsafe`CREATE EXTENSION IF NOT EXISTS vector`);
  await pool.query(sql.unsafe`DROP TABLE IF EXISTS slonik_items`);
  await pool.query(sql.unsafe`CREATE TABLE slonik_items (id serial PRIMARY KEY, embedding vector(3), half_embedding halfvec(3), binary_embedding bit(3), sparse_embedding sparsevec(3))`);

  const embedding1 = pgvector.toSql([1, 1, 1]);
  const embedding2 = pgvector.toSql([2, 2, 2]);
  const embedding3 = pgvector.toSql([1, 1, 2]);
  const halfEmbedding1 = pgvector.toSql([1, 1, 1]);
  const halfEmbedding2 = pgvector.toSql([2, 2, 2]);
  const halfEmbedding3 = pgvector.toSql([1, 1, 2]);
  const binaryEmbedding1 = '000';
  const binaryEmbedding2 = '101';
  const binaryEmbedding3 = '111';
  const sparseEmbedding1 = pgvector.toSql(new SparseVector([1, 1, 1]));
  const sparseEmbedding2 = pgvector.toSql(new SparseVector([2, 2, 2]));
  const sparseEmbedding3 = pgvector.toSql(new SparseVector([1, 1, 2]));
  await pool.query(sql.unsafe`INSERT INTO slonik_items (embedding, half_embedding, binary_embedding, sparse_embedding) VALUES (${embedding1}, ${halfEmbedding1}, ${binaryEmbedding1}, ${sparseEmbedding1}), (${embedding2}, ${halfEmbedding2}, ${binaryEmbedding2}, ${sparseEmbedding2}), (${embedding3}, ${halfEmbedding3}, ${binaryEmbedding3}, ${sparseEmbedding3})`);

  const embedding = pgvector.toSql([1, 1, 1]);
  const items = await pool.query(sql.unsafe`SELECT * FROM slonik_items ORDER BY embedding <-> ${embedding} LIMIT 5`);
  assert.deepEqual(items.rows.map(v => v.id), [1, 3, 2]);
  assert.deepEqual(pgvector.fromSql(items.rows[0].embedding), [1, 1, 1]);
  assert.deepEqual(pgvector.fromSql(items.rows[0].half_embedding), [1, 1, 1]);
  assert.equal(items.rows[0].binary_embedding, '000');
  assert.deepEqual(pgvector.fromSql(items.rows[0].sparse_embedding).toArray(), [1, 1, 1]);

  await pool.query(sql.unsafe`CREATE INDEX ON slonik_items USING hnsw (embedding vector_l2_ops)`);

  await pool.end();
});
