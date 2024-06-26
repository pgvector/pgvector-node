import pg from 'pg';
import pgvector from 'pgvector/pg';

test('example', async () => {
  const client = new pg.Client({database: 'pgvector_node_test'});
  await client.connect();

  await client.query('CREATE EXTENSION IF NOT EXISTS vector');
  await pgvector.registerType(client);

  await client.query('DROP TABLE IF EXISTS pg_items');
  await client.query('CREATE TABLE pg_items (id serial PRIMARY KEY, embedding vector(3), half_embedding halfvec(3), binary_embedding bit(3))');

  const params = [
    pgvector.toSql([1, 1, 1]), pgvector.toSql([1, 1, 1]), '000',
    pgvector.toSql([2, 2, 2]), pgvector.toSql([2, 2, 2]), '101',
    pgvector.toSql([1, 1, 2]), pgvector.toSql([1, 1, 2]), '111',
    null, null, null
  ];
  await client.query('INSERT INTO pg_items (embedding, half_embedding, binary_embedding) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9), ($10, $11, $12)', params);

  const { rows } = await client.query('SELECT * FROM pg_items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 1, 1])]);
  expect(rows.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);
  expect(rows[0].embedding).toStrictEqual([1, 1, 1]);
  expect(rows[1].embedding).toStrictEqual([1, 1, 2]);
  expect(rows[2].embedding).toStrictEqual([2, 2, 2]);
  expect(rows[0].half_embedding).toStrictEqual([1, 1, 1]);
  expect(rows[1].half_embedding).toStrictEqual([1, 1, 2]);
  expect(rows[2].half_embedding).toStrictEqual([2, 2, 2]);
  expect(rows[0].binary_embedding).toStrictEqual('000');
  expect(rows[1].binary_embedding).toStrictEqual('111');
  expect(rows[2].binary_embedding).toStrictEqual('101');

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
  expect(rows.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);
  expect(rows[0].embedding).toStrictEqual([1, 1, 1]);
  expect(rows[1].embedding).toStrictEqual([1, 1, 2]);
  expect(rows[2].embedding).toStrictEqual([2, 2, 2]);

  await pool.query('CREATE INDEX ON pg_items USING hnsw (embedding vector_l2_ops)');

  await pool.end();
});
