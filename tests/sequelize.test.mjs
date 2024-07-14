import assert from 'node:assert';
import test from 'node:test';
import { Sequelize, DataTypes } from 'sequelize';
import pgvector from 'pgvector/sequelize';
import { l2Distance, maxInnerProduct, cosineDistance, l1Distance, hammingDistance, jaccardDistance } from 'pgvector/sequelize';
import { SparseVector } from 'pgvector';

test('sequelize example', async () => {
  pgvector.registerTypes(Sequelize);

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
    },
    half_embedding: {
      type: DataTypes.HALFVEC(3)
    },
    binary_embedding: {
      type: 'BIT(3)'
    },
    sparse_embedding: {
      type: DataTypes.SPARSEVEC(3)
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

  await Item.create({embedding: [1, 1, 1], half_embedding: [1, 1, 1], binary_embedding: '000', sparse_embedding: new SparseVector([1, 1, 1])});
  await Item.create({embedding: [2, 2, 2], half_embedding: [2, 2, 2], binary_embedding: '101', sparse_embedding: new SparseVector([2, 2, 2])});
  await Item.create({embedding: [1, 1, 2], half_embedding: [1, 1, 2], binary_embedding: '111', sparse_embedding: new SparseVector([1, 1, 2])});

  // L2 distance
  let items = await Item.findAll({
    order: l2Distance('embedding', [1, 1, 1], sequelize),
    limit: 5
  });
  assert.deepEqual(items.map(v => v.id), [1, 3, 2]);
  assert.deepEqual(items[0].embedding, [1, 1, 1]);
  assert.deepEqual(items[1].embedding, [1, 1, 2]);
  assert.deepEqual(items[2].embedding, [2, 2, 2]);

  // L2 distance - halfvec
  items = await Item.findAll({
    order: l2Distance('half_embedding', [1, 1, 1], sequelize),
    limit: 5
  });
  assert.deepEqual(items.map(v => v.id), [1, 3, 2]);

  // L2 distance - sparsevec
  items = await Item.findAll({
    order: l2Distance('sparse_embedding', new SparseVector([1, 1, 1]), sequelize),
    limit: 5
  });
  assert.deepEqual(items.map(v => v.id), [1, 3, 2]);

  await Item.create({});

  // max inner product
  items = await Item.findAll({
    order: maxInnerProduct(sequelize.literal('"Item".embedding'), [1, 1, 1], sequelize),
    limit: 5
  });
  assert.deepEqual(items.map(v => v.id), [2, 3, 1, 4]);

  // cosine distance
  items = await Item.findAll({
    order: cosineDistance('embedding', [1, 1, 1], sequelize),
    limit: 5
  });
  assert.deepEqual(items.map(v => v.id).slice(2), [3, 4]);

  // L1 distance
  items = await Item.findAll({
    order: l1Distance('embedding', [1, 1, 1], sequelize),
    limit: 5
  });
  assert.deepEqual(items.map(v => v.id), [1, 3, 2, 4]);

  // Hamming distance
  items = await Item.findAll({
    order: hammingDistance('binary_embedding', '101', sequelize),
    limit: 5
  });
  assert.deepEqual(items.map(v => v.id), [2, 3, 1, 4]);

  // Jaccard distance
  items = await Item.findAll({
    order: jaccardDistance('binary_embedding', '101', sequelize),
    limit: 5
  });
  assert.deepEqual(items.map(v => v.id), [2, 3, 1, 4]);

  // bad value
  await assert.rejects(Item.create({embedding: 'bad'}), {message: /invalid input syntax for type vector/})

  sequelize.close();
});

test('dimensions', () => {
  assert.equal(DataTypes.VECTOR(3).toSql(), 'VECTOR(3)');
});

test('no dimensions', () => {
  assert.equal(DataTypes.VECTOR().toSql(), 'VECTOR');
});

test('bad dimensions', () => {
  assert.throws(() => {
    DataTypes.VECTOR('bad').toSql();
  }, {message: 'expected integer'});
});
