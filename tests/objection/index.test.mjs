import Knex from 'knex';
import { Model } from 'objection';
import { vector, l2Distance, maxInnerProduct, cosineDistance } from 'pgvector/objection';

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
    table.vector('embedding', {dimensions: 3});
  });

  const newItems = [
    {embedding: vector([1, 1, 1])},
    {embedding: vector([2, 2, 2])},
    {embedding: vector([1, 1, 2])},
    {embedding: null}
  ];
  await Item.query().insert(newItems);

  // L2 distance
  let items = await Item.query()
    .orderBy(l2Distance('embedding', [1, 1, 1]))
    .limit(5);
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);
  expect(vector(items[0].embedding).toArray()).toStrictEqual([1, 1, 1]);
  expect(vector(items[1].embedding).toArray()).toStrictEqual([1, 1, 2]);
  expect(vector(items[2].embedding).toArray()).toStrictEqual([2, 2, 2]);

  // max inner product
  items = await Item.query()
    .orderBy(maxInnerProduct('embedding', [1, 1, 1]))
    .limit(5);
  expect(items.map(v => v.id)).toStrictEqual([2, 3, 1, 4]);

  // cosine distance
  items = await Item.query()
    .orderBy(cosineDistance('embedding', [1, 1, 1]))
    .limit(5);
  expect(items.map(v => v.id).slice(2)).toStrictEqual([3, 4]);

  await knex.schema.alterTable('objection_items', function(table) {
    table.index(knex.raw('embedding vector_l2_ops'), 'objection_items_embedding_idx', 'hnsw');
  });

  await knex.destroy();
});
