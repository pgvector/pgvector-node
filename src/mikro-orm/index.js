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

function distance(op, em, column, value) {
  return em.raw(`?? ${op} ?`, [column, utils.toSql(value)]);
}

function l2Distance(em, column, value) {
  return distance('<->', em, column, value);
}

function maxInnerProduct(em, column, value) {
  return distance('<#>', em, column, value);
}

function cosineDistance(em, column, value) {
  return distance('<=>', em, column, value);
}

module.exports = {Vector, l2Distance, maxInnerProduct, cosineDistance};
