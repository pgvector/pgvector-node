const pgpromise = require('pg-promise');
const pgvector = require('pgvector/pg');

const initOptions = {
  async connect(e) {
    await pgvector.registerType(e.client);
  }
};
const pgp = pgpromise(initOptions);

const db = pgp({database: 'pgvector_node_test'});

beforeAll(async () => {
  await db.none('CREATE EXTENSION IF NOT EXISTS vector');
  await db.none('DROP TABLE IF EXISTS items');
  await db.none('CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3))');
});

afterAll(async () => {
  await pgp.end();
});

beforeEach(async () => {
  await db.none('DELETE FROM items');
});

test('works', async () => {
  await db.none('INSERT INTO items (embedding) VALUES ($1)', [pgvector.toSql([1, 2, 3])]);
  const rows = await db.any('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 2, 3])]);
  expect(rows[0].embedding).toStrictEqual([1, 2, 3]);
});

test('bad object', () => {
  expect(() => {
    pgvector.toSql({hello: 'world'});
  }).toThrowError('expected array');
});
