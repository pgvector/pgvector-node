import assert from 'node:assert';
import test from 'node:test';
import { SparseVector } from 'pgvector/utils';

test('fromSql', () => {
  const vec = new SparseVector('{1:1,3:2,5:3}/6');
  assert.deepEqual(vec.toArray(), [1, 0, 2, 0, 3, 0]);
  assert.equal(vec.dimensions, 6);
  assert.deepEqual(vec.indices, [0, 2, 4]);
  assert.deepEqual(vec.values, [1, 2, 3]);
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
  assert.deepEqual(vec.indices, [2, 4, 0]);
  assert.deepEqual(vec.values, [2, 3, 1]);
});

test('fromMapObject', () => {
  const map = {2: 2, 4: 3, 0: 1, 3: 0};
  const vec = new SparseVector(map, 6);
  assert.equal(vec.dimensions, 6);
  assert.deepEqual(vec.indices, [0, 2, 4]);
  assert.deepEqual(vec.values, [1, 2, 3]);
});

test('toPostgres', () => {
  const vec = new SparseVector([1.23456789]);
  assert.equal(vec.toPostgres(), '{1:1.23456789}/1');
});
