const util = require('util');
const utils = require('../utils');

function registerType(Sequelize) {
  const DataTypes = Sequelize.DataTypes;
  const PgTypes = DataTypes.postgres;
  const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

  class VECTOR extends ABSTRACT {
    constructor(dimensions) {
      super();
      this._dimensions = dimensions;
    }

    toSql() {
      return utils.sqlType(this._dimensions).toUpperCase();
    }

    _stringify(value) {
      return utils.toSql(value);
    }

    static parse(value) {
      return utils.fromSql(value);
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
}

function distance(op, column, value, sequelize) {
  const quotedColumn = sequelize.dialect.queryGenerator.quoteIdentifier(column);
  const escapedValue = sequelize.escape(utils.toSql(value));
  return sequelize.literal(`${quotedColumn} ${op} ${escapedValue}`);
}

function l2Distance(column, value, sequelize) {
  return distance('<->', column, value, sequelize);
}

function maxInnerProduct(column, value, sequelize) {
  return distance('<#>', column, value, sequelize);
}

function cosineDistance(column, value, sequelize) {
  return distance('<=>', column, value, sequelize);
}

module.exports = {registerType, l2Distance, maxInnerProduct, cosineDistance};
