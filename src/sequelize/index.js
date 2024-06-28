const { toSql } = require('../utils');
const { Utils } = require('sequelize');
const { registerHalfvec } = require('./halfvec');
const { registerSparsevec } = require('./sparsevec');
const { registerVector } = require('./vector');

function registerTypes(Sequelize) {
  registerVector(Sequelize);
  registerHalfvec(Sequelize);
  registerSparsevec(Sequelize);
}

function distance(op, column, value, sequelize, binary) {
  const quotedColumn = column instanceof Utils.Literal ? column.val : sequelize.dialect.queryGenerator.quoteIdentifier(column);
  const escapedValue = sequelize.escape(binary ? value : toSql(value));
  return sequelize.literal(`${quotedColumn} ${op} ${escapedValue}`);
}

function l2Distance(column, value, sequelize) {
  return distance('<->', column, value, sequelize);
}

function maxInnerProduct(column, value, sequelize) {
  return distance('<#>', column, value, sequelize);
}

function cosineDistance(column, value, sequelize) {
  return distance('<=>', column, value, sequelize);
}

function l1Distance(column, value, sequelize) {
  return distance('<+>', column, value, sequelize);
}

function hammingDistance(column, value, sequelize) {
  return distance('<~>', column, value, sequelize, true);
}

function jaccardDistance(column, value, sequelize) {
  return distance('<%>', column, value, sequelize, true);
}

const registerType = registerTypes;

module.exports = {
  registerType,
  registerTypes,
  l2Distance,
  maxInnerProduct,
  cosineDistance,
  l1Distance,
  hammingDistance,
  jaccardDistance
};
