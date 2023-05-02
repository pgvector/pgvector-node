"use strict";

var _pg = require("pg");
var _index = _interopRequireDefault(require("./index.mjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const client = new _pg.Client({
  database: 'pgvector_node_test'
});
beforeAll(async () => {
  await client.connect();
  const sql = `
  CREATE EXTENSION IF NOT EXISTS vector;
  DROP TABLE IF EXISTS items;
  CREATE TABLE items (
    id serial PRIMARY KEY,
    embedding vector(3)
  );
  `;
  await client.query(sql);
  await _index.default.registerType(client);
});
afterAll(async () => {
  await client.end();
});
beforeEach(async () => {
  await client.query('DELETE FROM items');
});
test('works', async () => {
  await client.query('INSERT INTO items (embedding) VALUES ($1)', [_index.default.toSql([1, 2, 3])]);
  const {
    rows
  } = await client.query('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [_index.default.toSql([1, 2, 3])]);
  expect(rows[0].embedding).toStrictEqual([1, 2, 3]);
});
test('bad object', () => {
  expect(() => {
    _index.default.toSql({
      hello: 'world'
    });
  }).toThrowError('expected array');
});