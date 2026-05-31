import { fromSql, toSql } from '../index.js';
import { raw } from 'objection';
import '../knex/index.js';

/** @import { SparseVector } from '../index.js' */

/**
 * @param {any} column
 * @param {number[] | SparseVector | null} value
 */
export function l2Distance(column, value) {
  return raw('?? <-> ?', [column, toSql(value)]);
}

/**
 * @param {any} column
 * @param {number[] | SparseVector | null} value
 */
export function maxInnerProduct(column, value) {
  return raw('?? <#> ?', [column, toSql(value)]);
}

/**
 * @param {any} column
 * @param {number[] | SparseVector | null} value
 */
export function cosineDistance(column, value) {
  return raw('?? <=> ?', [column, toSql(value)]);
}

/**
 * @param {any} column
 * @param {number[] | SparseVector | null} value
 */
export function l1Distance(column, value) {
  return raw('?? <+> ?', [column, toSql(value)]);
}

/**
 * @param {any} column
 * @param {string} value
 */
export function hammingDistance(column, value) {
  return raw('?? <~> ?', [column, value]);
}

/**
 * @param {any} column
 * @param {string} value
 */
export function jaccardDistance(column, value) {
  return raw('?? <%> ?', [column, value]);
}

export { fromSql, toSql };

export default { fromSql, toSql };
