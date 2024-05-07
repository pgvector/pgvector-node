const { Type } = require('@mikro-orm/core');
const utils = require('../utils');

class SparsevecType extends Type {
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return utils.toSparseSql(value);
  }

  convertToJSValue(value, platform) {
    if (value === null) {
      return null;
    }
    return utils.fromSparseSql(value);
  }

  getColumnType(prop, platform) {
    return utils.sparsevecType(prop.dimensions);
  }
}

module.exports = {SparsevecType};
