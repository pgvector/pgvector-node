const pgvector = require('pgvector/utils');
const { DataSource, EntitySchema } = require('typeorm');

const Item = new EntitySchema({
  name: 'Item',
  tableName: 'typeorm_items',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    embedding: {
      // vector type not supported
      type: 'text'
    }
  }
});

const AppDataSource = new DataSource({
  type: 'postgres',
  database: 'pgvector_node_test',
  logging: false,
  entities: [Item]
});

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.query('CREATE EXTENSION IF NOT EXISTS vector');
  await AppDataSource.query('DROP TABLE IF EXISTS typeorm_items');
  await AppDataSource.query('CREATE TABLE typeorm_items (id bigserial PRIMARY KEY, embedding vector(3))');
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {
  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Item)
    .execute();
});

test('works', async () => {
  const itemRepository = AppDataSource.getRepository(Item);
  await itemRepository.save({embedding: pgvector.toSql([1, 1, 1])});
  await itemRepository.save({embedding: pgvector.toSql([2, 2, 2])});
  await itemRepository.save({embedding: pgvector.toSql([1, 1, 2])});

  const items = await AppDataSource
    .createQueryBuilder()
    .select('item')
    .from(Item, 'item')
    .orderBy('embedding <-> :embedding')
    .setParameters({embedding: pgvector.toSql([1, 1, 1])})
    .limit(5)
    .getMany()
  expect(pgvector.fromSql(items[0].embedding)).toStrictEqual([1, 1, 1]);
  expect(pgvector.fromSql(items[1].embedding)).toStrictEqual([1, 1, 2]);
  expect(pgvector.fromSql(items[2].embedding)).toStrictEqual([2, 2, 2]);
});
