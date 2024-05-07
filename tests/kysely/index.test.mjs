import pg from 'pg';
import { Kysely, PostgresDialect, sql } from 'kysely';
import pgvector from 'pgvector/kysely';
import { l2Distance, maxInnerProduct, cosineDistance, l1Distance, hammingDistance, jaccardDistance } from 'pgvector/kysely';
import { SparseVector } from 'pgvector';

test('example', async () => {
  const dialect = new PostgresDialect({
    pool: new pg.Pool({
      database: 'pgvector_node_test'
    })
  });

  const db = new Kysely({
    dialect
  });

  await sql`CREATE EXTENSION IF NOT EXISTS vector`.execute(db);

  await db.schema.dropTable('kysely_items')
    .ifExists()
    .execute();

  await db.schema.createTable('kysely_items')
    .addColumn('id', 'serial', (cb) => cb.primaryKey())
    .addColumn('embedding', sql`vector(3)`)
    .addColumn('half_embedding', sql`halfvec(3)`)
    .addColumn('binary_embedding', sql`bit(3)`)
    .addColumn('sparse_embedding', sql`sparsevec(3)`)
    .execute();

  const newItems = [
    {embedding: pgvector.toSql([1, 1, 1]), half_embedding: pgvector.toSql([1, 1, 1]), binary_embedding: '000', sparse_embedding: SparseVector.fromDense([1, 1, 1]).toSql()},
    {embedding: pgvector.toSql([2, 2, 2]), half_embedding: pgvector.toSql([2, 2, 2]), binary_embedding: '101', sparse_embedding: SparseVector.fromDense([2, 2, 2]).toSql()},
    {embedding: pgvector.toSql([1, 1, 2]), half_embedding: pgvector.toSql([1, 1, 2]), binary_embedding: '111', sparse_embedding: SparseVector.fromDense([1, 1, 2]).toSql()},
    {embedding: null}
  ];
  await db.insertInto('kysely_items')
    .values(newItems)
    .execute();

  // L2 distance
  let items = await db.selectFrom('kysely_items')
    .selectAll()
    .orderBy(l2Distance('embedding', [1, 1, 1]))
    .limit(5)
    .execute();
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);
  expect(pgvector.fromSql(items[0].embedding)).toStrictEqual([1, 1, 1]);
  expect(pgvector.fromSql(items[1].embedding)).toStrictEqual([1, 1, 2]);
  expect(pgvector.fromSql(items[2].embedding)).toStrictEqual([2, 2, 2]);

  // L2 distance - halfvec
  items = await db.selectFrom('kysely_items')
    .selectAll()
    .orderBy(l2Distance('half_embedding', [1, 1, 1]))
    .limit(5)
    .execute();
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);

  // L2 distance - sparsevec
  items = await db.selectFrom('kysely_items')
    .selectAll()
    .orderBy(l2Distance('sparse_embedding', SparseVector.fromDense([1, 1, 1]).toSql()))
    .limit(5)
    .execute();
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);

  // max inner product
  items = await db.selectFrom('kysely_items')
    .selectAll()
    .orderBy(maxInnerProduct('embedding', [1, 1, 1]))
    .limit(5)
    .execute();
  expect(items.map(v => v.id)).toStrictEqual([2, 3, 1, 4]);

  // cosine distance
  items = await db.selectFrom('kysely_items')
    .selectAll()
    .orderBy(cosineDistance('embedding', [1, 1, 1]))
    .limit(5)
    .execute();
  expect(items.map(v => v.id).slice(2)).toStrictEqual([3, 4]);

  // L1 distance
  items = await db.selectFrom('kysely_items')
    .selectAll()
    .orderBy(l1Distance('embedding', [1, 1, 1]))
    .limit(5)
    .execute();
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);

  // Hamming distance
  items = await db.selectFrom('kysely_items')
    .selectAll()
    .orderBy(hammingDistance('binary_embedding', '101'))
    .limit(5)
    .execute();
  expect(items.map(v => v.id)).toStrictEqual([2, 3, 1, 4]);

  // Jaccard distance
  items = await db.selectFrom('kysely_items')
    .selectAll()
    .orderBy(jaccardDistance('binary_embedding', '101'))
    .limit(5)
    .execute();
  expect(items.map(v => v.id)).toStrictEqual([2, 3, 1, 4]);

  await db.schema.createIndex('kysely_items_embedding_idx')
    .on('kysely_items')
    .using('hnsw')
    .expression(sql`embedding vector_l2_ops`)
    .execute();

  db.destroy();
});
