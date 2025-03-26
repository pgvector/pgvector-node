const util = require('node:util');
const utils = require('../utils');

function registerHalfvec(Sequelize) {
  const DataTypes = Sequelize.DataTypes;
  const PgTypes = DataTypes.postgres;
  const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

  class HALFVEC extends ABSTRACT {
    constructor(dimensions) {
      super();
      this._dimensions = dimensions;
    }

    toSql() {
      return utils.halfvecType(this._dimensions).toUpperCase();
    }

    _stringify(value) {
      return utils.halfvecToSql(value);
    }

    static parse(value) {
      return utils.halfvecFromSql(value);
    }
  }

  HALFVEC.prototype.key = HALFVEC.key = 'halfvec';

  DataTypes.HALFVEC = Sequelize.Utils.classToInvokable(HALFVEC);
  DataTypes.HALFVEC.types.postgres = ['halfvec'];

  PgTypes.HALFVEC = function HALFVEC() {
    if (!(this instanceof PgTypes.HALFVEC)) {
      return new PgTypes.HALFVEC();
    }
    DataTypes.HALFVEC.apply(this, arguments);
  };
  util.inherits(PgTypes.HALFVEC, DataTypes.HALFVEC);
  PgTypes.HALFVEC.parse = DataTypes.HALFVEC.parse;
  PgTypes.HALFVEC.types = {postgres: ['halfvec']};
  DataTypes.postgres.HALFVEC.key = 'halfvec';

  // for migrations
  Sequelize.HALFVEC ??= DataTypes.HALFVEC;
}

module.exports = {registerHalfvec};
