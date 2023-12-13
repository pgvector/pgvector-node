const { Type } = require('@mikro-orm/core');
const utils = require('../utils');

class Vector extends Type {
  convertToDatabaseValue(value, platform) {
    return utils.toSql(value);
  }

  convertToJSValue(value, platform) {
    return utils.fromSql(value);
  }

  getColumnType(prop, platform) {
    return utils.sqlType(prop.dimensions);
  }
}

module.exports = {Vector};
