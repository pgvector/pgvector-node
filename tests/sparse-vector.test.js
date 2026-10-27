import assert from 'node:assert';
import test from 'node:test';
import { SparseVector } from 'pgvector';

test('fromSql', () => {
  const vec = new SparseVector('{1:1,3:2,5:3}/6');
  assert.deepEqual(vec.toArray(), [1, 0, 2, 0, 3, 0]);
  assert.equal(vec.dimensions, 6);
  assert.deepEqual(vec.indices, [0, 2, 4]);
  assert.deepEqual(vec.values, [1, 2, 3]);
});

test('fromSqlZero', () => {
  const vec = new SparseVector('{}/3');
  assert.deepEqual(vec.toArray(), [0, 0, 0]);
  assert.equal(vec.dimensions, 3);
  assert.deepEqual(vec.indices, []);
  assert.deepEqual(vec.values, []);
});

test('fromDense', () => {
  const vec = new SparseVector([1, 0, 2, 0, 3, 0]);
  assert.equal(vec.toPostgres(), '{1:1,3:2,5:3}/6');
  assert.equal(vec.dimensions, 6);
  assert.deepEqual(vec.indices, [0, 2, 4]);
  assert.deepEqual(vec.values, [1, 2, 3]);
});

test('fromMap', () => {
  const map = new Map();
  map.set(2, 2);
  map.set(4, 3);
  map.set(0, 1);
  map.set(3, 0);
  const vec = new SparseVector(map, 6);
  assert.equal(vec.dimensions, 6);
  assert.deepEqual(vec.indices, [0, 2, 4]);
  assert.deepEqual(vec.values, [1, 2, 3]);
  assert.equal(vec.toPostgres(), '{1:1,3:2,5:3}/6');
  assert.deepEqual(vec.toArray(), [1, 0, 2, 0, 3, 0]);
});

test('fromMapUnsortedNegativeValues', () => {
  const map = new Map([[5, -4.5], [1, 0], [3, -2], [0, 1.25]]);
  const vec = new SparseVector(map, 7);
  assert.deepEqual(vec.indices, [0, 3, 5]);
  assert.deepEqual(vec.values, [1.25, -2, -4.5]);
  assert.equal(vec.toPostgres(), '{1:1.25,4:-2,6:-4.5}/7');
  assert.deepEqual([...map], [[5, -4.5], [1, 0], [3, -2], [0, 1.25]]);
});

test('fromMapObject', () => {
  const map = {2: 2, 4: 3, 0: 1, 3: 0};
  const vec = new SparseVector(map, 6);
  assert.equal(vec.dimensions, 6);
  assert.deepEqual(vec.indices, [0, 2, 4]);
  assert.deepEqual(vec.values, [1, 2, 3]);
});

// TODO uncomment in 0.4.0
// test('fromMapNegativeIndex', () => {
//   assert.throws(() => new SparseVector({'-1': 1}, 3), {message: 'sparsevec index out of bounds'});
// });

// TODO uncomment in 0.4.0
// test('fromMapHigherIndex', () => {
//   assert.throws(() => new SparseVector({3: 1}, 3), {message: 'sparsevec index out of bounds'});
// });

// TODO uncomment in 0.4.0
// test('fromMapNegativeDimensions', () => {
//   assert.throws(() => new SparseVector({}, -1), {message: 'sparsevec cannot have negative dimensions'});
// });

test('toPostgres', () => {
  const vec = new SparseVector([1.23456789]);
  assert.equal(vec.toPostgres(), '{1:1.23456789}/1');
});
