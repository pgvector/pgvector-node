import pgvector from 'pgvector/utils';
import { SparseVector } from 'pgvector/utils';

test('fromSql', () => {
  expect(pgvector.fromSql('[1,2,3]')).toStrictEqual([1, 2, 3]);
  expect(pgvector.fromSql('{1:1,2:2,3:3}/3').toArray()).toStrictEqual([1, 2, 3]);
  expect(pgvector.fromSql(null)).toBeNull();
  expect(() => pgvector.fromSql('')).toThrowError('invalid text representation');
});

test('toSql', () => {
  expect(pgvector.toSql([1, 2, 3])).toEqual('[1,2,3]');
  expect(pgvector.toSql(new SparseVector([1, 2, 3]))).toEqual('{1:1,2:2,3:3}/3');
  expect(pgvector.toSql(null)).toBeNull();
  expect(() => pgvector.toSql({})).toThrowError('expected array or sparse vector');
});

test('sqlType', () => {
  expect(pgvector.sqlType()).toEqual('vector');
  expect(pgvector.sqlType(3)).toEqual('vector(3)');
  expect(() => pgvector.sqlType('3')).toThrow('expected integer');
});
