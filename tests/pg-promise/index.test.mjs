import pgpromise from 'pg-promise';
import pgvector from 'pgvector/pg-promise';
import { SparseVector } from 'pgvector';

test('example', async () => {
  const initOptions = {
    async connect(e) {
      await pgvector.registerType(e.client);
    }
  };
  const pgp = pgpromise(initOptions);
  const db = pgp({database: 'pgvector_node_test'});

  await db.none('CREATE EXTENSION IF NOT EXISTS vector');
  await db.none('DROP TABLE IF EXISTS pg_promise_items');
  await db.none('CREATE TABLE pg_promise_items (id serial PRIMARY KEY, embedding vector(3), half_embedding halfvec(3), binary_embedding bit(3), sparse_embedding sparsevec(3))');

  const params = [
    pgvector.toSql([1, 1, 1]), pgvector.toSql([1, 1, 1]), '000', new SparseVector([1, 1, 1]),
    pgvector.toSql([2, 2, 2]), pgvector.toSql([2, 2, 2]), '101', new SparseVector([2, 2, 2]),
    pgvector.toSql([1, 1, 2]), pgvector.toSql([1, 1, 2]), '111', new SparseVector([1, 1, 2]),
    null, null, null, null
  ];
  await db.none('INSERT INTO pg_promise_items (embedding, half_embedding, binary_embedding, sparse_embedding) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12), ($13, $14, $15, $16)', params);

  const items = await db.any('SELECT * FROM pg_promise_items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 1, 1])]);
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);
  expect(items[0].embedding).toStrictEqual([1, 1, 1]);
  expect(items[0].half_embedding).toStrictEqual([1, 1, 1]);
  expect(items[0].binary_embedding).toStrictEqual('000');
  expect(items[0].sparse_embedding.toArray()).toStrictEqual([1, 1, 1]);

  await db.none('CREATE INDEX ON pg_promise_items USING hnsw (embedding vector_l2_ops)');

  await pgp.end();
});
