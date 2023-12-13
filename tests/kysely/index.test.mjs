import pg from 'pg';
import { Kysely, PostgresDialect, sql } from 'kysely';
import pgvector from 'pgvector/utils';

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
    .addColumn('embedding', 'vector(3)')
    .execute();

  const newItems = [
    {embedding: pgvector.toSql([1, 1, 1])},
    {embedding: pgvector.toSql([2, 2, 2])},
    {embedding: pgvector.toSql([1, 1, 2])}
  ];
  await db.insertInto('kysely_items')
    .values(newItems)
    .execute();

  const items = await db.selectFrom('kysely_items')
    .selectAll()
    .orderBy(sql`embedding <-> '[1,1,1]'`)
    .limit(5)
    .execute();
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2]);
  expect(pgvector.fromSql(items[0].embedding)).toStrictEqual([1, 1, 1]);
  expect(pgvector.fromSql(items[1].embedding)).toStrictEqual([1, 1, 2]);
  expect(pgvector.fromSql(items[2].embedding)).toStrictEqual([2, 2, 2]);

  await db.schema.createIndex('kysely_items_embedding_idx')
    .on('kysely_items')
    .using('hnsw')
    .expression(sql`embedding vector_l2_ops`)
    .execute();

  db.destroy();
});
