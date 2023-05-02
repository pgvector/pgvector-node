"use strict";

var _index = _interopRequireDefault(require("../utils/index.js"));
var _client = require("@prisma/client");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const prisma = new _client.PrismaClient();
beforeEach(async () => {
  await prisma.item.deleteMany({});
});
test('works', async () => {
  // TODO use create when possible (field is not available in the generated client)
  // https://www.prisma.io/docs/concepts/components/prisma-schema/features-without-psl-equivalent#unsupported-field-types
  const embedding1 = _index.default.toSql([1, 1, 1]);
  const embedding2 = _index.default.toSql([2, 2, 2]);
  const embedding3 = _index.default.toSql([1, 1, 2]);
  await prisma.$executeRaw`INSERT INTO prisma_items (embedding) VALUES (${embedding1}::vector), (${embedding2}::vector), (${embedding3}::vector)`;

  // TODO use raw orderBy when available
  // https://github.com/prisma/prisma/issues/5848
  const embedding = _index.default.toSql([1, 1, 1]);
  const items = await prisma.$queryRaw`SELECT id, embedding::text FROM prisma_items ORDER BY embedding <-> ${embedding}::vector LIMIT 5`;
  expect(_index.default.fromSql(items[0].embedding)).toStrictEqual([1, 1, 1]);
  expect(_index.default.fromSql(items[1].embedding)).toStrictEqual([1, 1, 2]);
  expect(_index.default.fromSql(items[2].embedding)).toStrictEqual([2, 2, 2]);
});