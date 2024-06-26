import pgvector from 'pgvector';
import { SparseVector } from 'pgvector';
import { PrismaClient } from '@prisma/client';

test('vector', async () => {
  const prisma = new PrismaClient();

  // TODO use create when possible (field is not available in the generated client)
  // https://www.prisma.io/docs/concepts/components/prisma-schema/features-without-psl-equivalent#unsupported-field-types
  const embedding1 = pgvector.toSql([1, 1, 1]);
  const embedding2 = pgvector.toSql([2, 2, 2]);
  const embedding3 = pgvector.toSql([1, 1, 2]);
  await prisma.$executeRaw`INSERT INTO prisma_items (embedding) VALUES (${embedding1}::vector), (${embedding2}::vector), (${embedding3}::vector)`;

  // TODO use raw orderBy when available
  // https://github.com/prisma/prisma/issues/5848
  const embedding = pgvector.toSql([1, 1, 1]);
  const items = await prisma.$queryRaw`SELECT id, embedding::text FROM prisma_items ORDER BY embedding <-> ${embedding}::vector LIMIT 5`;
  expect(pgvector.fromSql(items[0].embedding)).toStrictEqual([1, 1, 1]);
  expect(pgvector.fromSql(items[1].embedding)).toStrictEqual([1, 1, 2]);
  expect(pgvector.fromSql(items[2].embedding)).toStrictEqual([2, 2, 2]);
});

test('halfvec', async () => {
  const prisma = new PrismaClient();

  // TODO use create when possible (field is not available in the generated client)
  // https://www.prisma.io/docs/concepts/components/prisma-schema/features-without-psl-equivalent#unsupported-field-types
  const embedding1 = pgvector.toSql([1, 1, 1]);
  const embedding2 = pgvector.toSql([2, 2, 2]);
  const embedding3 = pgvector.toSql([1, 1, 2]);
  await prisma.$executeRaw`INSERT INTO prisma_items (half_embedding) VALUES (${embedding1}::halfvec), (${embedding2}::halfvec), (${embedding3}::halfvec)`;

  // TODO use raw orderBy when available
  // https://github.com/prisma/prisma/issues/5848
  const embedding = pgvector.toSql([1, 1, 1]);
  const items = await prisma.$queryRaw`SELECT id, half_embedding::text FROM prisma_items ORDER BY half_embedding <-> ${embedding}::halfvec LIMIT 5`;
  expect(pgvector.fromSql(items[0].half_embedding)).toStrictEqual([1, 1, 1]);
  expect(pgvector.fromSql(items[1].half_embedding)).toStrictEqual([1, 1, 2]);
  expect(pgvector.fromSql(items[2].half_embedding)).toStrictEqual([2, 2, 2]);
});

test('bit', async () => {
  const prisma = new PrismaClient();

  // TODO use create when possible (field is not available in the generated client)
  // https://www.prisma.io/docs/concepts/components/prisma-schema/features-without-psl-equivalent#unsupported-field-types
  const embedding1 = '000';
  const embedding2 = '101';
  const embedding3 = '111';
  await prisma.$executeRaw`INSERT INTO prisma_items (binary_embedding) VALUES (${embedding1}::varbit), (${embedding2}::varbit), (${embedding3}::varbit)`;

  // TODO use raw orderBy when available
  // https://github.com/prisma/prisma/issues/5848
  const embedding = '101';
  const items = await prisma.$queryRaw`SELECT id, binary_embedding::text FROM prisma_items ORDER BY binary_embedding <~> ${embedding}::varbit LIMIT 5`;
  expect(items[0].binary_embedding).toStrictEqual('101');
  expect(items[1].binary_embedding).toStrictEqual('111');
  expect(items[2].binary_embedding).toStrictEqual('000');
});

test('sparsevec', async () => {
  const prisma = new PrismaClient();

  // TODO use create when possible (field is not available in the generated client)
  // https://www.prisma.io/docs/concepts/components/prisma-schema/features-without-psl-equivalent#unsupported-field-types
  const embedding1 = (new SparseVector([1, 1, 1])).toSql();
  const embedding2 = (new SparseVector([2, 2, 2])).toSql();
  const embedding3 = (new SparseVector([1, 1, 2])).toSql();
  await prisma.$executeRaw`INSERT INTO prisma_items (sparse_embedding) VALUES (${embedding1}::sparsevec), (${embedding2}::sparsevec), (${embedding3}::sparsevec)`;

  // TODO use raw orderBy when available
  // https://github.com/prisma/prisma/issues/5848
  const embedding = (new SparseVector([1, 1, 1])).toSql();
  const items = await prisma.$queryRaw`SELECT id, sparse_embedding::text FROM prisma_items ORDER BY sparse_embedding <-> ${embedding}::sparsevec LIMIT 5`;
  expect((new SparseVector(items[0].sparse_embedding)).toArray()).toStrictEqual([1, 1, 1]);
  expect((new SparseVector(items[1].sparse_embedding)).toArray()).toStrictEqual([1, 1, 2]);
  expect((new SparseVector(items[2].sparse_embedding)).toArray()).toStrictEqual([2, 2, 2]);
});

beforeEach(async () => {
  const prisma = new PrismaClient();
  await prisma.item.deleteMany({});
});
