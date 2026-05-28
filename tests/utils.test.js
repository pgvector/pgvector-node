import assert from 'node:assert';
import test from 'node:test';
import pgvector from 'pgvector/utils';
import { SparseVector } from 'pgvector/utils';

test('fromSql', () => {
  assert.deepEqual(pgvector.fromSql('[1,2,3]'), [1, 2, 3]);
  assert.deepEqual(pgvector.fromSql('{1:1,2:2,3:3}/3').toArray(), [1, 2, 3]);
  assert.equal(pgvector.fromSql(null), null);
  assert.throws(() => pgvector.fromSql(''), {message: 'invalid text representation'});
});

test('toSql', () => {
  assert.equal(pgvector.toSql([1, 2, 3]), '[1,2,3]');
  assert.equal(pgvector.toSql(new SparseVector([1, 2, 3])), '{1:1,2:2,3:3}/3');
  assert.equal(pgvector.toSql(null), null);
  assert.throws(() => pgvector.toSql({}), {message: 'expected array or sparse vector'});
});

test('sqlType', () => {
  assert.equal(pgvector.sqlType(), 'vector');
  assert.equal(pgvector.sqlType(3), 'vector(3)');
  assert.throws(() => pgvector.sqlType('3'), {message: 'expected integer'});
});
