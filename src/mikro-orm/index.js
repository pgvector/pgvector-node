import { raw } from '@mikro-orm/core';
import { BitType } from './bit.js';
import { HalfvecType } from './halfvec.js';
import { SparsevecType } from './sparsevec.js';
import { VectorType } from './vector.js';
import { toSql } from '../utils/index.js';

function distance(op, column, value, em, binary) {
  if (raw) {
    return raw(`?? ${op} ?`, [column, binary ? value : toSql(value)]);
  } else {
    return em.raw(`?? ${op} ?`, [column, binary ? value : toSql(value)]);
  }
}

function l2Distance(column, value, em) {
  return distance('<->', column, value, em);
}

function maxInnerProduct(column, value, em) {
  return distance('<#>', column, value, em);
}

function cosineDistance(column, value, em) {
  return distance('<=>', column, value, em);
}

function l1Distance(column, value, em) {
  return distance('<+>', column, value, em);
}

function hammingDistance(column, value, em) {
  return distance('<~>', column, value, em, true);
}

function jaccardDistance(column, value, em) {
  return distance('<%>', column, value, em, true);
}

export {
  VectorType,
  HalfvecType,
  BitType,
  SparsevecType,
  l2Distance,
  maxInnerProduct,
  cosineDistance,
  l1Distance,
  hammingDistance,
  jaccardDistance
};
