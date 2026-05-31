import { sql } from 'kysely';
import { fromSql, toSql } from '../index.js';

/** @import { SparseVector } from '../index.js' */

/**
 * @param {any} column
 * @param {number[] | SparseVector | null} value
 */
export function l2Distance(column, value) {
  return sql`${sql.ref(column)} <-> ${toSql(value)}`;
}

/**
 * @param {any} column
 * @param {number[] | SparseVector | null} value
 */
export function maxInnerProduct(column, value) {
  return sql`${sql.ref(column)} <#> ${toSql(value)}`;
}

/**
 * @param {any} column
 * @param {number[] | SparseVector | null} value
 */
export function cosineDistance(column, value) {
  return sql`${sql.ref(column)} <=> ${toSql(value)}`;
}

/**
 * @param {any} column
 * @param {number[] | SparseVector | null} value
 */
export function l1Distance(column, value) {
  return sql`${sql.ref(column)} <+> ${toSql(value)}`;
}

/**
 * @param {any} column
 * @param {string} value
 */
export function hammingDistance(column, value) {
  return sql`${sql.ref(column)} <~> ${value}`;
}

/**
 * @param {any} column
 * @param {string} value
 */
export function jaccardDistance(column, value) {
  return sql`${sql.ref(column)} <%> ${value}`;
}

export { fromSql, toSql };

export default { fromSql, toSql };
