import assert from 'node:assert';
import test from 'node:test';
import { l2Distance, innerProduct, cosineDistance, l1Distance, hammingDistance, jaccardDistance } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, vector, halfvec, bit, sparsevec } from 'drizzle-orm/pg-core';
import { SparseVector } from 'pgvector';
import postgres from 'postgres';

test('drizzle-orm example', async () => {
  const client = postgres({database: 'pgvector_node_test', onnotice: function () { }});
  const db = drizzle(client);

  await client`CREATE EXTENSION IF NOT EXISTS vector`;
  await client`DROP TABLE IF EXISTS drizzle_items`;
  await client`CREATE TABLE drizzle_items (id serial PRIMARY KEY, embedding vector(3), half_embedding halfvec(3), binary_embedding bit(3), sparse_embedding sparsevec(3))`;

  const items = pgTable('drizzle_items', {
    id: serial('id').primaryKey(),
    embedding: vector('embedding', {dimensions: 3}),
    halfEmbedding: halfvec('half_embedding', {dimensions: 3}),
    binaryEmbedding: bit('binary_embedding', {dimensions: 3}),
    sparseEmbedding: sparsevec('sparse_embedding', {dimensions: 3})
  });

  const newItems = [
    {embedding: [1, 1, 1], halfEmbedding: [1, 1, 1], binaryEmbedding: '000', sparseEmbedding: new SparseVector([1, 1, 1])},
    {embedding: [2, 2, 2], halfEmbedding: [2, 2, 2], binaryEmbedding: '101', sparseEmbedding: new SparseVector([2, 2, 2])},
    {embedding: [1, 1, 2], halfEmbedding: [1, 1, 2], binaryEmbedding: '111', sparseEmbedding: new SparseVector([1, 1, 2])},
    {embedding: null}
  ];
  await db.insert(items).values(newItems);

  // L2 distance
  let allItems = await db.select()
    .from(items)
    .orderBy(l2Distance(items.embedding, [1, 1, 1]))
    .limit(5);
  assert.deepEqual(allItems.map(v => v.id), [1, 3, 2, 4]);
  assert.deepEqual(allItems[0].embedding, [1, 1, 1]);
  assert.deepEqual(allItems[1].embedding, [1, 1, 2]);
  assert.deepEqual(allItems[2].embedding, [2, 2, 2]);

  // L2 distance - halfvec
  allItems = await db.select()
    .from(items)
    .orderBy(l2Distance(items.halfEmbedding, [1, 1, 1]))
    .limit(5);
  assert.deepEqual(allItems.map(v => v.id), [1, 3, 2, 4]);

  // L2 distance - sparsevec
  allItems = await db.select()
    .from(items)
    .orderBy(l2Distance(items.sparseEmbedding, new SparseVector([1, 1, 1])))
    .limit(5);
  assert.deepEqual(allItems.map(v => v.id), [1, 3, 2, 4]);

  // max inner product
  allItems = await db.select()
    .from(items)
    .orderBy(innerProduct(items.embedding, [1, 1, 1]))
    .limit(5);
  assert.deepEqual(allItems.map(v => v.id), [2, 3, 1, 4]);

  // cosine distance
  allItems = await db.select()
    .from(items)
    .orderBy(cosineDistance(items.embedding, [1, 1, 1]))
    .limit(5);
  assert.deepEqual(allItems.map(v => v.id).slice(2), [3, 4]);

  // L1 distance
  allItems = await db.select()
    .from(items)
    .orderBy(l1Distance(items.embedding, [1, 1, 1]))
    .limit(5);
  assert.deepEqual(allItems.map(v => v.id), [1, 3, 2, 4]);

  // Hamming distance
  allItems = await db.select()
    .from(items)
    .orderBy(hammingDistance(items.binaryEmbedding, '101'))
    .limit(5);
  assert.deepEqual(allItems.map(v => v.id), [2, 3, 1, 4]);

  // Jaccard distance
  allItems = await db.select()
    .from(items)
    .orderBy(jaccardDistance(items.binaryEmbedding, '101'))
    .limit(5);
  assert.deepEqual(allItems.map(v => v.id), [2, 3, 1, 4]);

  await client.end();
});
