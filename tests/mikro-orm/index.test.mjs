import { EntitySchema, MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Vector } from 'pgvector/mikro-orm';

test('example', async () => {
  const Item = new EntitySchema({
    name: 'Item',
    tableName: 'mikro_items',
    properties: {
      id: {type: Number, primary: true},
      embedding: {type: Vector, dimensions: 3}
    },
  });

  const orm = await MikroORM.init({
    entities: [Item],
    dbName: 'pgvector_node_test',
    type: 'postgresql'
  });
  const em = orm.em.fork();

  await em.execute('CREATE EXTENSION IF NOT EXISTS vector');
  await em.execute('DROP TABLE IF EXISTS mikro_items');
  await em.execute('CREATE TABLE mikro_items (id serial PRIMARY KEY, embedding vector(3))');

  em.create(Item, {embedding: [1, 1, 1]});
  em.create(Item, {embedding: [2, 2, 2]});
  em.create(Item, {embedding: [1, 1, 2]});

  const qb = em.createQueryBuilder(Item);
  const items = await qb
    .orderBy({[qb.raw("embedding <-> '[1,1,1]'")]: 'ASC'})
    .limit(5)
    .getResult();
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2]);
  expect(items[0].embedding).toStrictEqual([1, 1, 1]);
  expect(items[1].embedding).toStrictEqual([1, 1, 2]);
  expect(items[2].embedding).toStrictEqual([2, 2, 2]);

  orm.close();
});
