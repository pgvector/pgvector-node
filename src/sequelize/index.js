/// <reference path="./index.d.ts" preserve="true" />

import { deprecate } from 'node:util';
import { toSql } from '../index.js';
import { Utils } from 'sequelize';
import './halfvec.js';
import './sparsevec.js';
import './vector.js';

/** @import { Sequelize } from 'sequelize' */

const registerType = deprecate(/** @type {function(any): void} */ (Sequelize) => {}, "registerType() is deprecated. Use import 'pgvector/sequelize' instead.");
const registerTypes = deprecate(/** @type {function(any): void} */ (Sequelize) => {}, "registerTypes() is deprecated. Use import 'pgvector/sequelize' instead.");

/**
 * @param {string} op
 * @param {any} column
 * @param {any} value
 * @param {Sequelize} sequelize
 * @param {boolean} [binary]
 */
function distance(op, column, value, sequelize, binary) {
  // @ts-ignore
  const quotedColumn = column instanceof Utils.Literal ? column.val : sequelize.dialect.queryGenerator.quoteIdentifier(column);
  const escapedValue = sequelize.escape(binary ? value : toSql(value));
  return sequelize.literal(`${quotedColumn} ${op} ${escapedValue}`);
}

/**
 * @param {any} column
 * @param {any} value
 * @param {Sequelize} sequelize
 */
export function l2Distance(column, value, sequelize) {
  return distance('<->', column, value, sequelize);
}

/**
 * @param {any} column
 * @param {any} value
 * @param {Sequelize} sequelize
 */
export function maxInnerProduct(column, value, sequelize) {
  return distance('<#>', column, value, sequelize);
}

/**
 * @param {any} column
 * @param {any} value
 * @param {Sequelize} sequelize
 */
export function cosineDistance(column, value, sequelize) {
  return distance('<=>', column, value, sequelize);
}

/**
 * @param {any} column
 * @param {any} value
 * @param {Sequelize} sequelize
 */
export function l1Distance(column, value, sequelize) {
  return distance('<+>', column, value, sequelize);
}

/**
 * @param {any} column
 * @param {string} value
 * @param {Sequelize} sequelize
 */
export function hammingDistance(column, value, sequelize) {
  return distance('<~>', column, value, sequelize, true);
}

/**
 * @param {any} column
 * @param {string} value
 * @param {Sequelize} sequelize
 */
export function jaccardDistance(column, value, sequelize) {
  return distance('<%>', column, value, sequelize, true);
}

export { registerType, registerTypes };

export default { registerType, registerTypes };
