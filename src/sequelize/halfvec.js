import { inherits } from 'node:util';
import { Sequelize, DataTypes, Utils } from 'sequelize';
import { halfvecType, halfvecToSql, halfvecFromSql } from '../utils.js';

// @ts-ignore
const PgTypes = DataTypes.postgres;
const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

class HALFVEC extends ABSTRACT {
  /**
   * @param {number} [dimensions]
   */
  constructor(dimensions) {
    super();
    this._dimensions = dimensions;
  }

  toSql() {
    return halfvecType(this._dimensions).toUpperCase();
  }

  /**
   * @param {?number[]} value
   */
  _stringify(value) {
    return halfvecToSql(value);
  }

  /**
   * @param {?string} value
   */
  static parse(value) {
    return halfvecFromSql(value);
  }
}

HALFVEC.prototype.key = HALFVEC.key = 'halfvec';

// @ts-ignore
DataTypes.HALFVEC = Utils.classToInvokable(HALFVEC);
// @ts-ignore
DataTypes.HALFVEC.types.postgres = ['halfvec'];

PgTypes.HALFVEC = function HALFVEC() {
  if (!(this instanceof PgTypes.HALFVEC)) {
    return new PgTypes.HALFVEC();
  }
  // @ts-ignore
  DataTypes.HALFVEC.apply(this, arguments);
};
inherits(PgTypes.HALFVEC, DataTypes.HALFVEC);
// @ts-ignore
PgTypes.HALFVEC.parse = DataTypes.HALFVEC.parse;
PgTypes.HALFVEC.types = {postgres: ['halfvec']};
PgTypes.HALFVEC.key = 'halfvec';

// for migrations
// @ts-ignore
Sequelize.HALFVEC ??= DataTypes.HALFVEC;
