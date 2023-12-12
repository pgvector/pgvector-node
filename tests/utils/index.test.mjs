import pgvector from 'pgvector/utils';

test('fromSql', () => {
  expect(pgvector.fromSql('[1,2,3]')).toStrictEqual([1, 2, 3]);
});

test('toSql', () => {
  expect(pgvector.toSql([1, 2, 3])).toEqual('[1,2,3]');
});
