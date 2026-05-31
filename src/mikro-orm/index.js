import { raw } from '@mikro-orm/core';
import { toSql } from '../index.js';

export { BitType } from './bit.js';
export { HalfvecType } from './halfvec.js';
export { SparsevecType } from './sparsevec.js';
export { VectorType } from './vector.js';

/**
 * @param {string} op
 * @param {any} column
 * @param {any} value
 * @param {boolean} [binary]
 */
function distance(op, column, value, binary) {
  return raw(`?? ${op} ?`, [column, binary ? value : toSql(value)]);
}

/**
 * @param {any} column
 * @param {any} value
 */
export function l2Distance(column, value) {
  return distance('<->', column, value);
}

/**
 * @param {any} column
 * @param {any} value
 */
export function maxInnerProduct(column, value) {
  return distance('<#>', column, value);
}

/**
 * @param {any} column
 * @param {any} value
 */
export function cosineDistance(column, value) {
  return distance('<=>', column, value);
}

/**
 * @param {any} column
 * @param {any} value
 */
export function l1Distance(column, value) {
  return distance('<+>', column, value);
}

/**
 * @param {any} column
 * @param {any} value
 */
export function hammingDistance(column, value) {
  return distance('<~>', column, value, true);
}

/**
 * @param {any} column
 * @param {any} value
 */
export function jaccardDistance(column, value) {
  return distance('<%>', column, value, true);
}
