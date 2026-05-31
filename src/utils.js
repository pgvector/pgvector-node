import { format } from 'node:util';
import { SparseVector } from './sparse-vector.js';

/**
 * @param {?string} value
 * @returns {?number[]}
 */
export function vectorFromSql(value) {
  if (value === null) {
    return null;
  }
  return value.substring(1, value.length - 1).split(',').map((v) => parseFloat(v));
}

/**
 * @param {?number[]} value
 * @returns {?string}
 */
export function vectorToSql(value) {
  if (Array.isArray(value)) {
    return JSON.stringify(value.map((v) => Number(v)));
  }
  return value;
}

export { vectorFromSql as halfvecFromSql };
export { vectorToSql as halfvecToSql };

/**
 * @param {?string} value
 * @returns {?SparseVector}
 */
export function sparsevecFromSql(value) {
  if (value === null) {
    return null;
  }
  return new SparseVector(value);
}

/**
 * @param {?SparseVector} value
 * @returns {?string}
 */
export function sparsevecToSql(value) {
  if (value instanceof SparseVector) {
    return value.toPostgres();
  }
  return value;
}

/**
 * @param {string} name
 * @param {number | null | undefined} dimensions
 * @returns {string}
 */
function typeWithDimensions(name, dimensions) {
  if (dimensions === undefined || dimensions === null) {
    return name;
  }

  if (!Number.isInteger(dimensions)) {
    throw new Error('expected integer');
  }

  return format('%s(%d)', name, dimensions);
}

/**
 * @param {number | null | undefined} dimensions
 * @returns {string}
 */
export function vectorType(dimensions) {
  return typeWithDimensions('vector', dimensions);
}

/**
 * @param {number | null | undefined} dimensions
 * @returns {string}
 */
export function halfvecType(dimensions) {
  return typeWithDimensions('halfvec', dimensions);
}

/**
 * @param {number | null | undefined} dimensions
 * @returns {string}
 */
export function bitType(dimensions) {
  return typeWithDimensions('bit', dimensions);
}

/**
 * @param {number | null | undefined} dimensions
 * @returns {string}
 */
export function sparsevecType(dimensions) {
  return typeWithDimensions('sparsevec', dimensions);
}
