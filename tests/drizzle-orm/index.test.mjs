import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial } from 'drizzle-orm/pg-core';
import postgres from 'postgres';
import { cosineDistance, l2Distance, maxInnerProduct, l1Distance, hammingDistance, jaccardDistance, vector, halfvec, bit } from 'pgvector/drizzle-orm';

test('example', async () => {
  const client = postgres({database: 'pgvector_node_test', onnotice: function() {}});
  const db = drizzle(client);

  await client`CREATE EXTENSION IF NOT EXISTS vector`;
  await client`DROP TABLE IF EXISTS drizzle_items`;
  await client`CREATE TABLE drizzle_items (id serial PRIMARY KEY, embedding vector(3), half_embedding halfvec(3), binary_embedding bit(3))`;

  const items = pgTable('drizzle_items', {
    id: serial('id').primaryKey(),
    embedding: vector('embedding', {dimensions: 3}),
    halfEmbedding: halfvec('half_embedding', {dimensions: 3}),
    binaryEmbedding: bit('binary_embedding', {length: 3})
  });

  const newItems = [
    {embedding: [1, 1, 1], binaryEmbedding: '000'},
    {embedding: [2, 2, 2], binaryEmbedding: '101'},
    {embedding: [1, 1, 2], binaryEmbedding: '111'},
    {embedding: null}
  ];
  await db.insert(items).values(newItems);

  // L2 distance
  let allItems = await db.select()
    .from(items)
    .orderBy(l2Distance(items.embedding, [1, 1, 1]))
    .limit(5);
  expect(allItems.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);
  expect(allItems[0].embedding).toStrictEqual([1, 1, 1]);
  expect(allItems[1].embedding).toStrictEqual([1, 1, 2]);
  expect(allItems[2].embedding).toStrictEqual([2, 2, 2]);

  // max inner product
  allItems = await db.select()
    .from(items)
    .orderBy(maxInnerProduct(items.embedding, [1, 1, 1]))
    .limit(5);
  expect(allItems.map(v => v.id)).toStrictEqual([2, 3, 1, 4]);

  // cosine distance
  allItems = await db.select()
    .from(items)
    .orderBy(cosineDistance(items.embedding, [1, 1, 1]))
    .limit(5);
  expect(allItems.map(v => v.id).slice(2)).toStrictEqual([3, 4]);

  // L1 distance
  allItems = await db.select()
    .from(items)
    .orderBy(l1Distance(items.embedding, [1, 1, 1]))
    .limit(5);
  expect(allItems.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);

  // Hamming distance
  allItems = await db.select()
    .from(items)
    .orderBy(hammingDistance(items.binaryEmbedding, '101'))
    .limit(5);
  expect(allItems.map(v => v.id)).toStrictEqual([2, 3, 1, 4]);

  // Jaccard distance
  allItems = await db.select()
    .from(items)
    .orderBy(jaccardDistance(items.binaryEmbedding, '101'))
    .limit(5);
  expect(allItems.map(v => v.id)).toStrictEqual([2, 3, 1, 4]);

  await client.end();
});
