import { SparseVector } from './sparse-vector.js';
import { vectorFromSql, sparsevecFromSql, vectorToSql, sparsevecToSql } from './utils.js';

/**
 * @param {?string} value
 * @returns {number[] | SparseVector | null}
 */
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

/**
 * @param {number[] | SparseVector | null} value
 * @returns {?string}
 */
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
