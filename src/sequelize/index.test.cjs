"use strict";

var _sequelize = require("sequelize");
var _index = _interopRequireDefault(require("./index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_index.default.registerType(_sequelize.Sequelize);
class Item extends _sequelize.Model {}
let sequelize;
function connect() {
  return new _sequelize.Sequelize('postgres://localhost/pgvector_node_test', {
    logging: false
  });
}
beforeAll(async () => {
  sequelize = connect();
  await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector');

  // need to reconnect after the vector extension has been created
  sequelize.close();
  sequelize = connect();
  Item.init({
    embedding: {
      type: _sequelize.DataTypes.VECTOR(3)
    }
  }, {
    sequelize,
    modelName: 'Item'
  });
  await Item.sync({
    force: true
  });
});
afterAll(() => {
  sequelize.close();
});
beforeEach(async () => {
  await Item.destroy({
    truncate: true
  });
});
async function createItems() {
  await Item.create({
    id: 1,
    embedding: [1, 1, 1]
  });
  await Item.create({
    id: 2,
    embedding: [2, 2, 2]
  });
  await Item.create({
    id: 3,
    embedding: [1, 1, 2]
  });
}
test('L2 distance', async () => {
  await createItems();
  const items = await Item.findAll({
    order: [sequelize.literal(`embedding <-> '[1, 1, 1]'`)],
    limit: 5
  });
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2]);
  expect(items[1].embedding).toStrictEqual([1, 1, 2]);
});
test('max inner product', async () => {
  await createItems();
  const items = await Item.findAll({
    order: [sequelize.literal(`embedding <#> '[1, 1, 1]'`)],
    limit: 5
  });
  expect(items.map(v => v.id)).toStrictEqual([2, 3, 1]);
});
test('cosine distance', async () => {
  await createItems();
  const items = await Item.findAll({
    order: [sequelize.literal(`embedding <=> '[1, 1, 1]'`)],
    limit: 5
  });
  expect(items.map(v => v.id)).toStrictEqual([1, 2, 3]);
});
test('bad value', () => {
  expect.assertions(1);
  return Item.create({
    embedding: 'bad'
  }).catch(e => expect(e.message).toMatch('malformed vector literal'));
});
test('dimensions', () => {
  expect(_sequelize.DataTypes.VECTOR(3).toSql()).toBe('VECTOR(3)');
});
test('no dimensions', () => {
  expect(_sequelize.DataTypes.VECTOR().toSql()).toBe('VECTOR');
});
test('bad dimensions', () => {
  expect(() => {
    _sequelize.DataTypes.VECTOR('bad').toSql();
  }).toThrowError('expected integer');
});