import assert from 'node:assert';
import test from 'node:test';
import { MikroORM, EntityManager, EntitySchema } from '@mikro-orm/postgresql';
import { VectorType, HalfvecType, BitType, SparsevecType, l2Distance, maxInnerProduct, cosineDistance, l1Distance, hammingDistance, jaccardDistance } from 'pgvector/mikro-orm';
import { SparseVector } from 'pgvector';

test('mikro-orm example', async () => {
  const Item = new EntitySchema({
    name: 'Item',
    tableName: 'mikro_items',
    properties: {
      id: {type: Number, primary: true},
      embedding: {type: VectorType, dimensions: 3, nullable: true},
      half_embedding: {type: HalfvecType, dimensions: 3, nullable: true},
      binary_embedding: {type: BitType, length: 3, nullable: true},
      sparse_embedding: {type: SparsevecType, dimensions: 3, nullable: true}
    },
  });

  const orm = await MikroORM.init({
    entities: [Item],
    dbName: 'pgvector_node_test',
    user: process.env['USER']
  });
  const em = orm.em.fork();

  await em.execute('CREATE EXTENSION IF NOT EXISTS vector');
  await em.execute('DROP TABLE IF EXISTS mikro_items');

  const generator = orm.getSchemaGenerator();
  await generator.createSchema();

  em.create(Item, {embedding: [1, 1, 1], half_embedding: [1, 1, 1], binary_embedding: '000', sparse_embedding: new SparseVector([1, 1, 1])});
  em.create(Item, {embedding: [2, 2, 2], half_embedding: [2, 2, 2], binary_embedding: '101', sparse_embedding: new SparseVector([2, 2, 2])});
  em.create(Item, {embedding: [1, 1, 2], half_embedding: [1, 1, 2], binary_embedding: '111', sparse_embedding: new SparseVector([1, 1, 2])});
  em.create(Item, {embedding: null});

  // L2 distance
  let items = await em.createQueryBuilder(Item)
    .orderBy({[l2Distance('embedding', [1, 1, 1])]: 'ASC'})
    .limit(5)
    .getResult();
  assert.deepEqual(items.map(v => v.id), [1, 3, 2, 4]);
  assert.deepEqual(items[0].embedding, [1, 1, 1]);
  assert.deepEqual(items[1].embedding, [1, 1, 2]);
  assert.deepEqual(items[2].embedding, [2, 2, 2]);

  // L2 distance - halfvec
  items = await em.createQueryBuilder(Item)
    .orderBy({[l2Distance('half_embedding', [1, 1, 1])]: 'ASC'})
    .limit(5)
    .getResult();
  assert.deepEqual(items.map(v => v.id), [1, 3, 2, 4]);

  // L2 distance - sparsevec
  items = await em.createQueryBuilder(Item)
    .orderBy({[l2Distance('sparse_embedding', new SparseVector([1, 1, 1]))]: 'ASC'})
    .limit(5)
    .getResult();
  assert.deepEqual(items.map(v => v.id), [1, 3, 2, 4]);

  // max inner product
  items = await em.createQueryBuilder(Item)
    .orderBy({[maxInnerProduct('embedding', [1, 1, 1])]: 'ASC'})
    .limit(5)
    .getResult();
  assert.deepEqual(items.map(v => v.id), [2, 3, 1, 4]);

  // cosine distance
  items = await em.createQueryBuilder(Item)
    .orderBy({[cosineDistance('embedding', [1, 1, 1])]: 'ASC'})
    .limit(5)
    .getResult();
  assert.deepEqual(items.map(v => v.id).slice(2), [3, 4]);

  // L1 distance
  items = await em.createQueryBuilder(Item)
    .orderBy({[l1Distance('embedding', [1, 1, 1])]: 'ASC'})
    .limit(5)
    .getResult();
  assert.deepEqual(items.map(v => v.id), [1, 3, 2, 4]);

  // Hamming distance
  items = await em.createQueryBuilder(Item)
    .orderBy({[hammingDistance('binary_embedding', '101')]: 'ASC'})
    .limit(5)
    .getResult();
  assert.deepEqual(items.map(v => v.id), [2, 3, 1, 4]);

  // Jaccard distance
  items = await em.createQueryBuilder(Item)
    .orderBy({[jaccardDistance('binary_embedding', '101')]: 'ASC'})
    .limit(5)
    .getResult();
  assert.deepEqual(items.map(v => v.id), [2, 3, 1, 4]);

  orm.close();
});
