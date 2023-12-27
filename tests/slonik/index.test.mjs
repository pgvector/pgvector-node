import pgvector from 'pgvector';
import { createPool, sql } from 'slonik';

test('example', async () => {
  const pool = await createPool('postgres://localhost/pgvector_node_test');

  await pool.query(sql.unsafe`CREATE EXTENSION IF NOT EXISTS vector`);
  await pool.query(sql.unsafe`DROP TABLE IF EXISTS slonik_items`);
  await pool.query(sql.unsafe`CREATE TABLE slonik_items (id serial PRIMARY KEY, embedding vector(3))`);

  const embedding1 = pgvector.toSql([1, 1, 1]);
  const embedding2 = pgvector.toSql([2, 2, 2]);
  const embedding3 = pgvector.toSql([1, 1, 2]);
  await pool.query(sql.unsafe`INSERT INTO slonik_items (embedding) VALUES (${embedding1}), (${embedding2}), (${embedding3})`);

  const embedding = pgvector.toSql([1, 1, 1]);
  const items = await pool.query(sql.unsafe`SELECT * FROM slonik_items ORDER BY embedding <-> ${embedding} LIMIT 5`);
  expect(items.rows.map(v => v.id)).toStrictEqual([1, 3, 2]);
  expect(pgvector.fromSql(items.rows[0].embedding)).toStrictEqual([1, 1, 1]);
  expect(pgvector.fromSql(items.rows[1].embedding)).toStrictEqual([1, 1, 2]);
  expect(pgvector.fromSql(items.rows[2].embedding)).toStrictEqual([2, 2, 2]);

  await pool.query(sql.unsafe`CREATE INDEX ON slonik_items USING hnsw (embedding vector_l2_ops)`);

  await pool.end();
});
