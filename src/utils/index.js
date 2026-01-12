import util from 'node:util';
import { SparseVector } from './sparse-vector.js';

export { SparseVector } from './sparse-vector.js';

export function vectorFromSql(value) {
  if (value === null) {
    return null;
  }
  return value.substring(1, value.length - 1).split(',').map((v) => parseFloat(v));
}

export function vectorToSql(value) {
  if (Array.isArray(value)) {
    return JSON.stringify(value.map((v) => Number(v)));
  }
  return value;
}

export { vectorFromSql as halfvecFromSql };
export { vectorToSql as halfvecToSql };

export function sparsevecFromSql(value) {
  if (value === null) {
    return null;
  }
  return new SparseVector(value);
}

export function sparsevecToSql(value) {
  if (value instanceof SparseVector) {
    return value.toPostgres();
  }
  return value;
}

export function fromSql(value) {
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

export function toSql(value) {
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

function typeWithDimensions(name, dimensions) {
  if (dimensions === undefined || dimensions === null) {
    return name;
  }

  if (!Number.isInteger(dimensions)) {
    throw new Error('expected integer');
  }

  return util.format('%s(%d)', name, dimensions);
}

export function vectorType(dimensions) {
  return typeWithDimensions('vector', dimensions);
}

export function halfvecType(dimensions) {
  return typeWithDimensions('halfvec', dimensions);
}

export function bitType(dimensions) {
  return typeWithDimensions('bit', dimensions);
}

export function sparsevecType(dimensions) {
  return typeWithDimensions('sparsevec', dimensions);
}

// for backwards compatibility
export const sqlType = vectorType;

export default { fromSql, toSql, sqlType };
