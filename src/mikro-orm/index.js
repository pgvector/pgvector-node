import { raw } from '@mikro-orm/core';
import { toSql } from '../utils/index.js';

export { BitType } from './bit.js';
export { HalfvecType } from './halfvec.js';
export { SparsevecType } from './sparsevec.js';
export { VectorType } from './vector.js';

function distance(op, column, value, em, binary) {
  if (raw) {
    return raw(`?? ${op} ?`, [column, binary ? value : toSql(value)]);
  } else {
    return em.raw(`?? ${op} ?`, [column, binary ? value : toSql(value)]);
  }
}

export function l2Distance(column, value, em) {
  return distance('<->', column, value, em);
}

export function maxInnerProduct(column, value, em) {
  return distance('<#>', column, value, em);
}

export function cosineDistance(column, value, em) {
  return distance('<=>', column, value, em);
}

export function l1Distance(column, value, em) {
  return distance('<+>', column, value, em);
}

export function hammingDistance(column, value, em) {
  return distance('<~>', column, value, em, true);
}

export function jaccardDistance(column, value, em) {
  return distance('<%>', column, value, em, true);
}
