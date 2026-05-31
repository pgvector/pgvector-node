import { inherits } from 'node:util';
import { Sequelize, DataTypes, Utils } from 'sequelize';
import { vectorType, vectorToSql, vectorFromSql } from '../utils.js';

// @ts-ignore
const PgTypes = DataTypes.postgres;
const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

class VECTOR extends ABSTRACT {
  /**
   * @param {number} [dimensions]
   */
  constructor(dimensions) {
    super();
    this._dimensions = dimensions;
  }

  toSql() {
    return vectorType(this._dimensions).toUpperCase();
  }

  /**
   * @param {?number[]} value
   */
  _stringify(value) {
    return vectorToSql(value);
  }

  /**
   * @param {?string} value
   */
  static parse(value) {
    return vectorFromSql(value);
  }
}

VECTOR.prototype.key = VECTOR.key = 'vector';

// @ts-ignore
DataTypes.VECTOR = Utils.classToInvokable(VECTOR);
// @ts-ignore
DataTypes.VECTOR.types.postgres = ['vector'];

PgTypes.VECTOR = function VECTOR() {
  if (!(this instanceof PgTypes.VECTOR)) {
    return new PgTypes.VECTOR();
  }
  // @ts-ignore
  DataTypes.VECTOR.apply(this, arguments);
};
inherits(PgTypes.VECTOR, DataTypes.VECTOR);
// @ts-ignore
PgTypes.VECTOR.parse = DataTypes.VECTOR.parse;
PgTypes.VECTOR.types = {postgres: ['vector']};
PgTypes.VECTOR.key = 'vector';

// for migrations
// @ts-ignore
Sequelize.VECTOR ??= DataTypes.VECTOR;
