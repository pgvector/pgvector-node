import util from 'node:util';
import { sparsevecType, sparsevecToSql, sparsevecFromSql } from '../utils/index.js';

export function registerSparsevec(Sequelize) {
  const DataTypes = Sequelize.DataTypes;
  const PgTypes = DataTypes.postgres;
  const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

  class SPARSEVEC extends ABSTRACT {
    constructor(dimensions) {
      super();
      this._dimensions = dimensions;
    }

    toSql() {
      return sparsevecType(this._dimensions).toUpperCase();
    }

    _stringify(value) {
      return sparsevecToSql(value);
    }

    static parse(value) {
      return sparsevecFromSql(value);
    }
  }

  SPARSEVEC.prototype.key = SPARSEVEC.key = 'sparsevec';

  DataTypes.SPARSEVEC = Sequelize.Utils.classToInvokable(SPARSEVEC);
  DataTypes.SPARSEVEC.types.postgres = ['sparsevec'];

  PgTypes.SPARSEVEC = function SPARSEVEC() {
    if (!(this instanceof PgTypes.SPARSEVEC)) {
      return new PgTypes.SPARSEVEC();
    }
    DataTypes.SPARSEVEC.apply(this, arguments);
  };
  util.inherits(PgTypes.SPARSEVEC, DataTypes.SPARSEVEC);
  PgTypes.SPARSEVEC.parse = DataTypes.SPARSEVEC.parse;
  PgTypes.SPARSEVEC.types = {postgres: ['sparsevec']};
  DataTypes.postgres.SPARSEVEC.key = 'sparsevec';

  // for migrations
  Sequelize.SPARSEVEC ??= DataTypes.SPARSEVEC;
}
