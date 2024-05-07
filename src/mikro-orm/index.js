const { Type, raw } = require('@mikro-orm/core');
const { BitType } = require('./bit');
const { HalfvecType } = require('./halfvec');
const { VectorType } = require('./vector');
const utils = require('../utils');

function distance(op, column, value, em) {
  if (raw) {
    return raw(`?? ${op} ?`, [column, utils.toSql(value)]);
  } else {
    return em.raw(`?? ${op} ?`, [column, utils.toSql(value)]);
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

module.exports = {
  VectorType,
  HalfvecType,
  BitType,
  l2Distance,
  maxInnerProduct,
  cosineDistance,
  l1Distance
};
