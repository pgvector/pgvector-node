import { inherits } from 'node:util';
import { Sequelize, DataTypes, Utils } from 'sequelize';
import { sparsevecType, sparsevecToSql, sparsevecFromSql } from '../utils.js';

/** @import { SparseVector } from '../index.js' */

// @ts-ignore
const PgTypes = DataTypes.postgres;
const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

class SPARSEVEC extends ABSTRACT {
  /**
   * @param {number} [dimensions]
   */
  constructor(dimensions) {
    super();
    this._dimensions = dimensions;
  }

  toSql() {
    return sparsevecType(this._dimensions).toUpperCase();
  }

  /**
   * @param {?SparseVector} value
   */
  _stringify(value) {
    return sparsevecToSql(value);
  }

  /**
   * @param {?string} value
   */
  static parse(value) {
    return sparsevecFromSql(value);
  }
}

SPARSEVEC.prototype.key = SPARSEVEC.key = 'sparsevec';

// @ts-ignore
DataTypes.SPARSEVEC = Utils.classToInvokable(SPARSEVEC);
// @ts-ignore
DataTypes.SPARSEVEC.types.postgres = ['sparsevec'];

PgTypes.SPARSEVEC = function SPARSEVEC() {
  if (!(this instanceof PgTypes.SPARSEVEC)) {
    return new PgTypes.SPARSEVEC();
  }
  // @ts-ignore
  DataTypes.SPARSEVEC.apply(this, arguments);
};
inherits(PgTypes.SPARSEVEC, DataTypes.SPARSEVEC);
// @ts-ignore
PgTypes.SPARSEVEC.parse = DataTypes.SPARSEVEC.parse;
PgTypes.SPARSEVEC.types = {postgres: ['sparsevec']};
PgTypes.SPARSEVEC.key = 'sparsevec';

// for migrations
// @ts-ignore
Sequelize.SPARSEVEC ??= DataTypes.SPARSEVEC;
