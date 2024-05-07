const util = require('node:util');
const utils = require('../utils');
const { Utils } = require('sequelize');

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
      return utils.vectorType(this._dimensions).toUpperCase();
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

  class HALFVEC extends ABSTRACT {
    constructor(dimensions) {
      super();
      this._dimensions = dimensions;
    }

    toSql() {
      return utils.halfvecType(this._dimensions).toUpperCase();
    }

    _stringify(value) {
      return utils.toSql(value);
    }

    static parse(value) {
      return utils.fromSql(value);
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

  class SPARSEVEC extends ABSTRACT {
    constructor(dimensions) {
      super();
      this._dimensions = dimensions;
    }

    toSql() {
      return utils.sparsevecType(this._dimensions).toUpperCase();
    }

    _stringify(value) {
      return utils.toSparseSql(value);
    }

    static parse(value) {
      return utils.fromSparseSql(value);
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
}

function distance(op, column, value, sequelize, binary) {
  const quotedColumn = column instanceof Utils.Literal ? column.val : sequelize.dialect.queryGenerator.quoteIdentifier(column);
  const escapedValue = sequelize.escape(binary ? value : utils.toAnySql(value));
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

function l1Distance(column, value, sequelize) {
  return distance('<+>', column, value, sequelize);
}

function hammingDistance(column, value, sequelize) {
  return distance('<~>', column, value, sequelize, true);
}

function jaccardDistance(column, value, sequelize) {
  return distance('<%>', column, value, sequelize, true);
}

module.exports = {
  registerType,
  l2Distance,
  maxInnerProduct,
  cosineDistance,
  l1Distance,
  hammingDistance,
  jaccardDistance
};
