import util from 'node:util';
import { vectorType, vectorToSql, vectorFromSql } from '../utils/index.js';

function registerVector(Sequelize) {
  const DataTypes = Sequelize.DataTypes;
  const PgTypes = DataTypes.postgres;
  const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

  class VECTOR extends ABSTRACT {
    constructor(dimensions) {
      super();
      this._dimensions = dimensions;
    }

    toSql() {
      return vectorType(this._dimensions).toUpperCase();
    }

    _stringify(value) {
      return vectorToSql(value);
    }

    static parse(value) {
      return vectorFromSql(value);
    }
  }

  VECTOR.prototype.key = VECTOR.key = 'vector';

  DataTypes.VECTOR = Sequelize.Utils.classToInvokable(VECTOR);
  DataTypes.VECTOR.types.postgres = ['vector'];

  PgTypes.VECTOR = function VECTOR() {
    if (!(this instanceof PgTypes.VECTOR)) {
      return new PgTypes.VECTOR();
    }
    DataTypes.VECTOR.apply(this, arguments);
  };
  util.inherits(PgTypes.VECTOR, DataTypes.VECTOR);
  PgTypes.VECTOR.parse = DataTypes.VECTOR.parse;
  PgTypes.VECTOR.types = {postgres: ['vector']};
  DataTypes.postgres.VECTOR.key = 'vector';

  // for migrations
  Sequelize.VECTOR ??= DataTypes.VECTOR;
}

export { registerVector };
