import { toSql } from '../utils/index.js';
import { Utils } from 'sequelize';
import { registerHalfvec } from './halfvec.js';
import { registerSparsevec } from './sparsevec.js';
import { registerVector } from './vector.js';

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

export function l2Distance(column, value, sequelize) {
  return distance('<->', column, value, sequelize);
}

export function maxInnerProduct(column, value, sequelize) {
  return distance('<#>', column, value, sequelize);
}

export function cosineDistance(column, value, sequelize) {
  return distance('<=>', column, value, sequelize);
}

export function l1Distance(column, value, sequelize) {
  return distance('<+>', column, value, sequelize);
}

export function hammingDistance(column, value, sequelize) {
  return distance('<~>', column, value, sequelize, true);
}

export function jaccardDistance(column, value, sequelize) {
  return distance('<%>', column, value, sequelize, true);
}

const registerType = registerTypes;

export default {
  registerType,
  registerTypes
};
