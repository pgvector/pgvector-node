import { Sequelize, DataTypes, Model } from 'sequelize';
import pgvector from 'pgvector/sequelize';

class Item extends Model {}

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

  Item.init({
    embedding: {
      type: DataTypes.VECTOR(3)
    }
  }, {
    sequelize,
    modelName: 'Item'
  });

  await Item.sync({force: true});

  await Item.create({id: 1, embedding: [1, 1, 1]});
  await Item.create({id: 2, embedding: [2, 2, 2]});
  await Item.create({id: 3, embedding: [1, 1, 2]});

  // L2 distance
  let items = await Item.findAll({
    order: sequelize.literal(`embedding <-> '[1, 1, 1]'`),
    limit: 5
  });
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2]);
  expect(items[1].embedding).toStrictEqual([1, 1, 2]);

  // max inner product
  items = await Item.findAll({
    order: sequelize.literal(`embedding <#> '[1, 1, 1]'`),
    limit: 5
  });
  expect(items.map(v => v.id)).toStrictEqual([2, 3, 1]);

  // cosine distance
  items = await Item.findAll({
    order: sequelize.literal(`embedding <=> '[1, 1, 1]'`),
    limit: 5
  });
  expect(items[2].id).toEqual(3);

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
