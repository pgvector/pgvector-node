import { vector } from 'pgvector';
import { PrismaClient } from '@prisma/client';

test('example', async () => {
  const prisma = new PrismaClient();

  // TODO use create when possible (field is not available in the generated client)
  // https://www.prisma.io/docs/concepts/components/prisma-schema/features-without-psl-equivalent#unsupported-field-types
  const embedding1 = vector([1, 1, 1]).toString();
  const embedding2 = vector([2, 2, 2]).toString();
  const embedding3 = vector([1, 1, 2]).toString();
  await prisma.$executeRaw`INSERT INTO prisma_items (embedding) VALUES (${embedding1}::vector), (${embedding2}::vector), (${embedding3}::vector)`;

  // TODO use raw orderBy when available
  // https://github.com/prisma/prisma/issues/5848
  const embedding = vector([1, 1, 1]).toString();
  const items = await prisma.$queryRaw`SELECT id, embedding::text FROM prisma_items ORDER BY embedding <-> ${embedding}::vector LIMIT 5`;
  expect(vector(items[0].embedding).toArray()).toStrictEqual([1, 1, 1]);
  expect(vector(items[1].embedding).toArray()).toStrictEqual([1, 1, 2]);
  expect(vector(items[2].embedding).toArray()).toStrictEqual([2, 2, 2]);
});

beforeAll(async () => {
  const prisma = new PrismaClient();
  await prisma.item.deleteMany({});
});
