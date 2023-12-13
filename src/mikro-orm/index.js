const { Type } = require('@mikro-orm/core');
const utils = require('../utils');

class Vector extends Type {
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return utils.toSql(value);
  }

  convertToJSValue(value, platform) {
    if (value === null) {
      return null;
    }
    return utils.fromSql(value);
  }

  getColumnType(prop, platform) {
    return utils.sqlType(prop.dimensions);
  }
}

function distance(op, column, value, em) {
  return em.raw(`?? ${op} ?`, [column, utils.toSql(value)]);
}

function l2Distance(column, value, em) {
  return distance('<->', column, value, em);
}

function maxInnerProduct(column, value, em) {
  return distance('<#>', column, value, em);
}

function cosineDistance(column, value, em) {
  return distance('<=>', column, value, em);
}

module.exports = {Vector, l2Distance, maxInnerProduct, cosineDistance};
