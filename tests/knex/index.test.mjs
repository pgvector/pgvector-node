import Knex from 'knex';
import pgvector from 'pgvector/utils';

test('example', async () => {
  const knex = Knex({
    client: 'pg',
    connection: {database: 'pgvector_node_test'}
  });

  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS vector');
  await knex.schema.dropTableIfExists('knex_items');
  await knex.schema.createTable('knex_items', (table) => {
    table.increments('id');
    table.specificType('embedding', 'vector(3)');
  });

  const newItems = [
    {embedding: pgvector.toSql([1, 1, 1])},
    {embedding: pgvector.toSql([2, 2, 2])},
    {embedding: pgvector.toSql([1, 1, 2])}
  ];
  await knex('knex_items').insert(newItems);

  const items = await knex('knex_items')
    .orderByRaw('embedding <-> ?', pgvector.toSql([1, 1, 1]))
    .limit(5);
  expect(pgvector.fromSql(items[0].embedding)).toStrictEqual([1, 1, 1]);
  expect(pgvector.fromSql(items[1].embedding)).toStrictEqual([1, 1, 2]);
  expect(pgvector.fromSql(items[2].embedding)).toStrictEqual([2, 2, 2]);

  await knex.destroy();
});
