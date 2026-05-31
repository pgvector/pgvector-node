// @ts-nocheck

import { deprecate } from 'node:util';
import { toSql } from '../index.js';
import { Utils } from 'sequelize';
import './halfvec.js';
import './sparsevec.js';
import './vector.js';

const registerType = deprecate((Sequelize) => {}, "registerType() is deprecated. Use import 'pgvector/sequelize' instead.");
const registerTypes = deprecate((Sequelize) => {}, "registerTypes() is deprecated. Use import 'pgvector/sequelize' instead.");

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

export { registerType, registerTypes };

export default { registerType, registerTypes };
