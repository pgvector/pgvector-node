"use strict";

var _index = _interopRequireDefault(require("../pg/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initOptions = {
  async connect(e) {
    await _index.default.registerType(e.client);
  }
};
const pgp = require('pg-promise')(initOptions);
const db = pgp({
  database: 'pgvector_node_test'
});
beforeAll(async () => {
  const sql = `
  CREATE EXTENSION IF NOT EXISTS vector;
  DROP TABLE IF EXISTS items;
  CREATE TABLE items (
    id serial PRIMARY KEY,
    embedding vector(3)
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
  await db.none('INSERT INTO items (embedding) VALUES ($1)', [_index.default.toSql([1, 2, 3])]);
  const rows = await db.any('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [_index.default.toSql([1, 2, 3])]);
  expect(rows[0].embedding).toStrictEqual([1, 2, 3]);
});
test('bad object', () => {
  expect(() => {
    _index.default.toSql({
      hello: 'world'
    });
  }).toThrowError('expected array');
});