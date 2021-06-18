const { Sequelize, DataTypes, Model } = require('sequelize');
const pgvector = require('./index');

pgvector.registerType(Sequelize);

class Item extends Model {}

let sequelize;

function connect() {
  return new Sequelize('postgres://localhost/pgvector_node_test', {
    logging: false
  });
}

beforeAll(async () => {
  sequelize = connect();
  await sequelize.authenticate();
  await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector');

  // need to reconnect after the vector extension has been created
  await sequelize.close();
  sequelize = connect();

  Item.init({
    factors: {
      type: DataTypes.VECTOR(3)
    }
  }, {
    sequelize,
    modelName: 'Item'
  });

  await Item.sync({force: true});
});

afterAll(() => {
  sequelize.close();
});

test('works', async () => {
  await Item.create({factors: [1, 1, 1]});
  await Item.create({factors: [2, 2, 2]});
  await Item.create({factors: [1, 1, 2]});
  const items = await Item.findAll({
    order: [sequelize.literal(`factors <-> '[1, 1, 1]'`)],
    limit: 5
  });
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2]);
  expect(items[1].factors).toStrictEqual([1, 1, 2]);
});

test('bad value', () => {
  expect.assertions(1);
  return Item.create({factors: 'bad'}).catch(e => expect(e.message).toMatch('malformed vector literal'));
});

test('dimensions', () => {
  expect(DataTypes.VECTOR(3).toSql()).toBe('VECTOR(3)');
});

test('no dimensions', () => {
  expect(DataTypes.VECTOR().toSql()).toBe('VECTOR');
});

test('bad dimensions', () => {
  expect(() => {
    DataTypes.VECTOR('bad').toSql();
  }).toThrowError('expected integer');
});
