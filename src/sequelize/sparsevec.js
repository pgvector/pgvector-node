const util = require('node:util');
const utils = require('../utils');

function registerSparsevec(Sequelize) {
  const DataTypes = Sequelize.DataTypes;
  const PgTypes = DataTypes.postgres;
  const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

  class SPARSEVEC extends ABSTRACT {
    constructor(dimensions) {
      super();
      this._dimensions = dimensions;
    }

    toSql() {
      return utils.sparsevecType(this._dimensions).toUpperCase();
    }

    _stringify(value) {
      return utils.sparsevecToSql(value);
    }

    static parse(value) {
      return utils.sparsevecFromSql(value);
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

module.exports = {registerSparsevec};
