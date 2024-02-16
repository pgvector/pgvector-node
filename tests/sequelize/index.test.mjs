import { Sequelize, DataTypes, Model } from 'sequelize';
import pgvector from 'pgvector/sequelize';
import { l2Distance, maxInnerProduct, cosineDistance } from 'pgvector/sequelize';

test('example', async () => {
  pgvector.registerType(Sequelize);

  let sequelize = new Sequelize('postgres://localhost/pgvector_node_test', {
    logging: false
  });
  await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector');

  // need to reconnect after the vector extension has been created
  sequelize.close();
  sequelize = new Sequelize('postgres://localhost/pgvector_node_test', {
    logging: false
  });

  const Item = sequelize.define('Item', {
    embedding: {
      type: DataTypes.VECTOR(3)
    }
  }, {
    modelName: 'Item',
    tableName: 'sequelize_items',
    indexes: [
      {
        fields: ['embedding'],
        using: 'hnsw',
        operator: 'vector_l2_ops'
      }
    ]
  });

  await Item.sync({force: true});

  await Item.create({embedding: [1, 1, 1]});
  await Item.create({embedding: [2, 2, 2]});
  await Item.create({embedding: [1, 1, 2]});

  // L2 distance
  let items = await Item.findAll({
    order: l2Distance('embedding', [1, 1, 1], sequelize),
    limit: 5
  });
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2]);
  expect(items[0].embedding).toStrictEqual([1, 1, 1]);
  expect(items[1].embedding).toStrictEqual([1, 1, 2]);
  expect(items[2].embedding).toStrictEqual([2, 2, 2]);

  await Item.create({});

  // max inner product
  items = await Item.findAll({
    order: maxInnerProduct(sequelize.literal('"Item".embedding'), [1, 1, 1], sequelize),
    limit: 5
  });
  expect(items.map(v => v.id)).toStrictEqual([2, 3, 1, 4]);

  // cosine distance
  items = await Item.findAll({
    order: cosineDistance('embedding', [1, 1, 1], sequelize),
    limit: 5
  });
  expect(items.map(v => v.id).slice(2)).toStrictEqual([3, 4]);

  // bad value
  await Item.create({embedding: 'bad'}).catch(e => expect(e.message).toMatch('malformed vector literal'));

  sequelize.close();
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
