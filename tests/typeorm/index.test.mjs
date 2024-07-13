import assert from 'node:assert';
import test from 'node:test';
import pgvector from 'pgvector';
import { SparseVector } from 'pgvector';
import { DataSource, EntitySchema } from 'typeorm';

test('example', async () => {
  // entity definition without decorators
  // https://typeorm.io/separating-entity-definition
  const Item = new EntitySchema({
    name: 'Item',
    tableName: 'typeorm_items',
    columns: {
      id: {
        type: Number,
        primary: true,
        generated: true
      },
      // custom types not supported
      // https://github.com/typeorm/typeorm/issues/10056
      embedding: {
        type: String
      },
      half_embedding: {
        type: String
      },
      binary_embedding: {
        type: String
      },
      sparse_embedding: {
        type: String
      }
    }
  });

  const AppDataSource = new DataSource({
    type: 'postgres',
    database: 'pgvector_node_test',
    logging: false,
    entities: [Item]
  });
  await AppDataSource.initialize();

  await AppDataSource.query('CREATE EXTENSION IF NOT EXISTS vector');
  await AppDataSource.query('DROP TABLE IF EXISTS typeorm_items');
  await AppDataSource.query('CREATE TABLE typeorm_items (id bigserial PRIMARY KEY, embedding vector(3), half_embedding halfvec(3), binary_embedding bit(3), sparse_embedding sparsevec(3))');

  const itemRepository = AppDataSource.getRepository(Item);
  await itemRepository.save({embedding: pgvector.toSql([1, 1, 1]), half_embedding: pgvector.toSql([1, 1, 1]), binary_embedding: '000', sparse_embedding: new SparseVector([1, 1, 1])});
  await itemRepository.save({embedding: pgvector.toSql([2, 2, 2]), half_embedding: pgvector.toSql([2, 2, 2]), binary_embedding: '101', sparse_embedding: new SparseVector([2, 2, 2])});
  await itemRepository.save({embedding: pgvector.toSql([1, 1, 2]), half_embedding: pgvector.toSql([1, 1, 2]), binary_embedding: '111', sparse_embedding: new SparseVector([1, 1, 2])});

  const items = await itemRepository
    .createQueryBuilder('item')
    .orderBy('embedding <-> :embedding')
    .setParameters({embedding: pgvector.toSql([1, 1, 1])})
    .limit(5)
    .getMany();
  assert.deepEqual(items.map(v => v.id), [1, 3, 2]);
  assert.deepEqual(pgvector.fromSql(items[0].embedding), [1, 1, 1]);
  assert.deepEqual(pgvector.fromSql(items[0].half_embedding), [1, 1, 1]);
  assert.equal(items[0].binary_embedding, '000');
  assert.deepEqual((new SparseVector(items[0].sparse_embedding).toArray()), [1, 1, 1]);

  await AppDataSource.destroy();
});
