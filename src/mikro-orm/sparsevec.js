const { Type } = require('@mikro-orm/core');
const utils = require('../utils');

class SparsevecType extends Type {
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return utils.sparsevecToSql(value);
  }

  convertToJSValue(value, platform) {
    if (value === null) {
      return null;
    }
    return utils.sparsevecFromSql(value);
  }

  getColumnType(prop, platform) {
    return utils.sparsevecType(prop.dimensions);
  }
}

module.exports = {SparsevecType};
