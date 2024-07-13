import assert from 'node:assert';
import test from 'node:test';
import Knex from 'knex';
import { Model } from 'objection';
import pgvector from 'pgvector/objection';
import { l2Distance, maxInnerProduct, cosineDistance, l1Distance, hammingDistance, jaccardDistance } from 'pgvector/objection';
import { SparseVector } from 'pgvector';

test('example', async () => {
  const knex = Knex({
    client: 'pg',
    connection: {database: 'pgvector_node_test'}
  });

  Model.knex(knex);

  class Item extends Model {
    static get tableName() {
      return 'objection_items';
    }
  }

  await knex.schema.enableExtension('vector');
  await knex.schema.dropTableIfExists('objection_items');
  await knex.schema.createTable('objection_items', (table) => {
    table.increments('id');
    table.vector('embedding', 3);
    table.halfvec('half_embedding', 3);
    table.bit('binary_embedding', {length: 3});
    table.sparsevec('sparse_embedding', 3);
  });

  const newItems = [
    {embedding: pgvector.toSql([1, 1, 1]), half_embedding: pgvector.toSql([1, 1, 1]), binary_embedding: '000', sparse_embedding: new SparseVector([1, 1, 1])},
    {embedding: pgvector.toSql([2, 2, 2]), half_embedding: pgvector.toSql([2, 2, 2]), binary_embedding: '101', sparse_embedding: new SparseVector([2, 2, 2])},
    {embedding: pgvector.toSql([1, 1, 2]), half_embedding: pgvector.toSql([1, 1, 2]), binary_embedding: '111', sparse_embedding: new SparseVector([1, 1, 2])},
    {embedding: null}
  ];
  await Item.query().insert(newItems);

  // L2 distance
  let items = await Item.query()
    .orderBy(l2Distance('embedding', [1, 1, 1]))
    .limit(5);
  assert.deepEqual(items.map(v => v.id), [1, 3, 2, 4]);
  assert.deepEqual(pgvector.fromSql(items[0].embedding), [1, 1, 1]);
  assert.deepEqual(pgvector.fromSql(items[1].embedding), [1, 1, 2]);
  assert.deepEqual(pgvector.fromSql(items[2].embedding), [2, 2, 2]);

  // L2 distance - halfvec
  items = await Item.query()
    .orderBy(l2Distance('half_embedding', [1, 1, 1]))
    .limit(5);
  assert.deepEqual(items.map(v => v.id), [1, 3, 2, 4]);

  // L2 distance - sparsevec
  items = await Item.query()
    .orderBy(l2Distance('sparse_embedding', new SparseVector([1, 1, 1])))
    .limit(5);
  assert.deepEqual(items.map(v => v.id), [1, 3, 2, 4]);

  // max inner product
  items = await Item.query()
    .orderBy(maxInnerProduct('embedding', [1, 1, 1]))
    .limit(5);
  assert.deepEqual(items.map(v => v.id), [2, 3, 1, 4]);

  // cosine distance
  items = await Item.query()
    .orderBy(cosineDistance('embedding', [1, 1, 1]))
    .limit(5);
  assert.deepEqual(items.map(v => v.id).slice(2), [3, 4]);

  // L1 distance
  items = await Item.query()
    .orderBy(l1Distance('embedding', [1, 1, 1]))
    .limit(5);
  assert.deepEqual(items.map(v => v.id), [1, 3, 2, 4]);

  // Hamming distance
  items = await Item.query()
    .orderBy(hammingDistance('binary_embedding', '101'))
    .limit(5);
  assert.deepEqual(items.map(v => v.id), [2, 3, 1, 4]);

  // Jaccard distance
  items = await Item.query()
    .orderBy(jaccardDistance('binary_embedding', '101'))
    .limit(5);
  assert.deepEqual(items.map(v => v.id), [2, 3, 1, 4]);

  await knex.schema.alterTable('objection_items', function (table) {
    table.index(knex.raw('embedding vector_l2_ops'), 'objection_items_embedding_idx', 'hnsw');
  });

  await knex.destroy();
});
