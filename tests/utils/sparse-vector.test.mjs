import { SparseVector } from 'pgvector/utils';

test('fromSql', () => {
  const vec = SparseVector.fromSql('{1:1,3:2,5:3}/6');
  expect(vec.toArray()).toStrictEqual([1, 0, 2, 0, 3, 0]);
  expect(vec.dimensions).toStrictEqual(6);
  expect(vec.indices).toStrictEqual([0, 2, 4]);
  expect(vec.values).toStrictEqual([1, 2, 3]);
});

test('fromDense', () => {
  const vec = SparseVector.fromDense([1, 0, 2, 0, 3, 0]);
  expect(vec.toSql()).toStrictEqual('{1:1,3:2,5:3}/6');
  expect(vec.dimensions).toStrictEqual(6);
  expect(vec.indices).toStrictEqual([0, 2, 4]);
  expect(vec.values).toStrictEqual([1, 2, 3]);
});

test('fromMap', () => {
  const map = new Map();
  map.set(2, 2);
  map.set(4, 3);
  map.set(0, 1);
  map.set(3, 0);
  const vec = SparseVector.fromMap(map, 6);
  expect(vec.dimensions).toStrictEqual(6);
  expect(vec.indices).toStrictEqual([2, 4, 0]);
  expect(vec.values).toStrictEqual([2, 3, 1]);
});

test('toSql', () => {
  const vec = SparseVector.fromDense([1.23456789]);
  expect(vec.toSql()).toStrictEqual('{1:1.23456789}/1');
});
