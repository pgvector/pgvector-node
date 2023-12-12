import pgpromise from 'pg-promise';
import pgvector from 'pgvector/pg';

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
  await db.none('CREATE TABLE pg_promise_items (id bigserial PRIMARY KEY, embedding vector(3))');

  await db.none('INSERT INTO pg_promise_items (embedding) VALUES ($1)', [pgvector.toSql([1, 2, 3])]);

  const items = await db.any('SELECT * FROM pg_promise_items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 2, 3])]);
  expect(items[0].embedding).toStrictEqual([1, 2, 3]);

  await pgp.end();
});
