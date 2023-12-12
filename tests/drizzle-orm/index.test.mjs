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
    {embedding: [1, 1, 1]},
    {embedding: [2, 2, 2]},
    {embedding: [1, 1, 2]}
  ];
  await db.insert(items).values(newItems);

  const allItems = await db.select()
    .from(items)
    .orderBy(l2Distance(items.embedding, [1, 1, 1]))
    .limit(5);
  expect(allItems[0].embedding).toStrictEqual([1, 1, 1]);
  expect(allItems[1].embedding).toStrictEqual([1, 1, 2]);
  expect(allItems[2].embedding).toStrictEqual([2, 2, 2]);

  await client.end();
});
