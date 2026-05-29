import { SparseVector } from './sparse-vector.js';
import { vectorFromSql, sparsevecFromSql, vectorToSql, sparsevecToSql } from './utils/index.js';

function fromSql(value) {
  if (value === null) {
    return null;
  } else if (value[0] == '[') {
    return vectorFromSql(value);
  } else if (value[0] == '{') {
    return sparsevecFromSql(value);
  } else {
    throw new Error('invalid text representation');
  }
}

function toSql(value) {
  if (value === null) {
    return null;
  } else if (Array.isArray(value)) {
    return vectorToSql(value);
  } else if (value instanceof SparseVector) {
    return sparsevecToSql(value);
  } else {
    throw new Error('expected array or sparse vector');
  }
}

export { fromSql, toSql, SparseVector };

export default { fromSql, toSql };
