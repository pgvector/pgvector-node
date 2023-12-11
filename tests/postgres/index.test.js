const postgres = require('postgres');
const pgvector = require('pgvector/utils');

const sql = postgres({database: 'pgvector_node_test', onnotice: function() {}});

beforeAll(async () => {
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  await sql`DROP TABLE IF EXISTS postgres_items`;
  await sql`CREATE TABLE postgres_items (id bigserial PRIMARY KEY, embedding vector(3))`;
});

afterAll(async () => {
  await sql.end();
});

test('works', async () => {
  const items = [
    {embedding: pgvector.toSql([1, 2, 3])},
    {embedding: pgvector.toSql([4, 5, 6])}
  ];
  await sql`INSERT INTO postgres_items ${ sql(items, 'embedding') }`;

  const embedding = pgvector.toSql([1, 2, 3]);
  const rows = await sql`SELECT * FROM postgres_items ORDER BY embedding <-> ${ embedding } LIMIT 5`;
  expect(pgvector.fromSql(rows[0].embedding)).toStrictEqual([1, 2, 3]);
});
