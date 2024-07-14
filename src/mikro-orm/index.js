const { raw } = require('@mikro-orm/core');
const { BitType } = require('./bit');
const { HalfvecType } = require('./halfvec');
const { SparsevecType } = require('./sparsevec');
const { VectorType } = require('./vector');
const { toSql } = require('../utils');

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

module.exports = {
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
