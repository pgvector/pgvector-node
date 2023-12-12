import postgres from 'postgres';
import pgvector from 'pgvector/utils';

test('example', async () => {
  const sql = postgres({database: 'pgvector_node_test', onnotice: function() {}});

  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  await sql`DROP TABLE IF EXISTS postgres_items`;
  await sql`CREATE TABLE postgres_items (id bigserial PRIMARY KEY, embedding vector(3))`;

  const newItems = [
    {embedding: pgvector.toSql([1, 2, 3])},
    {embedding: pgvector.toSql([4, 5, 6])}
  ];
  await sql`INSERT INTO postgres_items ${ sql(newItems, 'embedding') }`;

  const embedding = pgvector.toSql([1, 2, 3]);
  const items = await sql`SELECT * FROM postgres_items ORDER BY embedding <-> ${ embedding } LIMIT 5`;
  expect(pgvector.fromSql(items[0].embedding)).toStrictEqual([1, 2, 3]);

  await sql.end();
});
