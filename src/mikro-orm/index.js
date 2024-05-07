const { Type, raw } = require('@mikro-orm/core');
const { BitType } = require('./bit');
const { HalfvecType } = require('./halfvec');
const { VectorType } = require('./vector');
const utils = require('../utils');

function distance(op, column, value, em, binary) {
  if (raw) {
    return raw(`?? ${op} ?`, [column, binary ? value : utils.toSql(value)]);
  } else {
    return em.raw(`?? ${op} ?`, [column, binary ? value : utils.toSql(value)]);
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
  l2Distance,
  maxInnerProduct,
  cosineDistance,
  l1Distance,
  hammingDistance,
  jaccardDistance
};
