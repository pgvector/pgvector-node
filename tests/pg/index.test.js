const { Client, Pool } = require('pg');
const pgvector = require('pgvector/pg');

const client = new Client({database: 'pgvector_node_test'});

beforeAll(async () => {
  await client.connect();
  await client.query('CREATE EXTENSION IF NOT EXISTS vector');
  await client.query('DROP TABLE IF EXISTS items');
  await client.query('CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3))');
  await pgvector.registerType(client);
});

afterAll(async () => {
  await client.end();
});

beforeEach(async () => {
  await client.query('DELETE FROM items');
});

test('works', async () => {
  await client.query('INSERT INTO items (embedding) VALUES ($1)', [pgvector.toSql([1, 2, 3])]);
  const { rows } = await client.query('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 2, 3])]);
  expect(rows[0].embedding).toStrictEqual([1, 2, 3]);
});

test('bad object', () => {
  expect(() => {
    pgvector.toSql({hello: 'world'});
  }).toThrowError('expected array');
});

test('pool', async () => {
  const pool = new Pool({database: 'pgvector_node_test'});
  pool.on('connect', async function (client) {
    await pgvector.registerType(client);
  });
  await pool.query('INSERT INTO items (embedding) VALUES ($1)', [pgvector.toSql([1, 2, 3])]);
  const { rows } = await pool.query('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 2, 3])]);
  expect(rows[0].embedding).toStrictEqual([1, 2, 3]);
  await pool.end();
});
