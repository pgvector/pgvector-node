const { sql } = require('drizzle-orm');
const { drizzle } = require('drizzle-orm/postgres-js');
const { pgTable, serial } = require('drizzle-orm/pg-core');
const postgres = require('postgres');
const { vector } = require('../drizzle-orm/index');

const client = postgres({database: 'pgvector_node_test', onnotice: function() {}});
const db = drizzle(client);

const items = pgTable('drizzle_items', {
  id: serial('id').primaryKey(),
  embedding: vector('embedding', {dimensions: 3})
});

beforeAll(async () => {
  await client`CREATE EXTENSION IF NOT EXISTS vector`;
  await client`DROP TABLE IF EXISTS drizzle_items`;
  await client`CREATE TABLE drizzle_items (id serial PRIMARY KEY, embedding vector(3))`;
});

afterAll(async () => {
  await client.end();
});

test('works', async () => {
  const newItems = [
    {embedding: [1, 2, 3]},
    {embedding: [4, 5, 6]}
  ];
  await db.insert(items).values(newItems);

  const embedding = items.embedding.mapToDriverValue([1, 2, 3]);
  const allItems = await db.select().from(items).orderBy(sql`${items.embedding} <-> ${embedding}`).limit(5);
  expect(allItems[0].embedding).toStrictEqual([1, 2, 3]);
});
