import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial } from 'drizzle-orm/pg-core';
import postgres from 'postgres';
import { l2Distance, vector } from 'pgvector/drizzle-orm';

test('example', async () => {
  const client = postgres({database: 'pgvector_node_test', onnotice: function() {}});
  const db = drizzle(client);

  await client`CREATE EXTENSION IF NOT EXISTS vector`;
  await client`DROP TABLE IF EXISTS drizzle_items`;
  await client`CREATE TABLE drizzle_items (id serial PRIMARY KEY, embedding vector(3))`;

  const items = pgTable('drizzle_items', {
    id: serial('id').primaryKey(),
    embedding: vector('embedding', {dimensions: 3})
  });

  const newItems = [
    {embedding: [1, 2, 3]},
    {embedding: [4, 5, 6]}
  ];
  await db.insert(items).values(newItems);

  const allItems = await db.select()
    .from(items)
    .orderBy(l2Distance(items.embedding, [1, 2, 3]))
    .limit(5);
  expect(allItems[0].embedding).toStrictEqual([1, 2, 3]);

  await client.end();
});
