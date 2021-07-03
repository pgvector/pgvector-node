const pgvector = require('../pg/index');
const initOptions = {
  async connect(client, dc, useCount) {
    await pgvector.registerType(client);
  }
};
const pgp = require('pg-promise')(initOptions);

const db = pgp({database: 'pgvector_node_test'});

beforeAll(async () => {
  const sql = `
  CREATE EXTENSION IF NOT EXISTS vector;
  DROP TABLE IF EXISTS items;
  CREATE TABLE IF NOT EXISTS items (
    id serial primary key,
    factors vector(3)
  );
  `;
  await db.none(sql);
});

afterAll(async () => {
  await pgp.end();
});

beforeEach(async () => {
  await db.none('DELETE FROM items');
});

test('works', async () => {
  await db.none('INSERT INTO items (factors) VALUES ($1)', [pgvector.toSql([1, 2, 3])]);
  const rows = await db.any('SELECT * FROM items ORDER BY factors <-> $1 LIMIT 5', [pgvector.toSql([1, 2, 3])]);
  expect(rows[0].factors).toStrictEqual([1, 2, 3]);
});

test('bad object', () => {
  expect(() => {
    pgvector.toSql({hello: 'world'});
  }).toThrowError('expected array');
});
