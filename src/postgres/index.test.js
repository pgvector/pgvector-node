const postgres = require('postgres');
const pgvector = require('../utils/index');

const sql = postgres({database: 'pgvector_node_test'});

test('works', async () => {
  const items = [
    {'embedding': pgvector.toSql([1, 2, 3])},
    {'embedding': pgvector.toSql([4, 5, 6])}
  ];
  await sql`INSERT INTO items ${ sql(items, 'embedding') }`;
  const rows = await sql`SELECT * FROM items ORDER BY embedding <-> ${ pgvector.toSql([1, 2, 3]) } LIMIT 5`;
  expect(pgvector.fromSql(rows[0].embedding)).toStrictEqual([1, 2, 3]);
});

afterAll(async () => {
  await sql.end();
});
