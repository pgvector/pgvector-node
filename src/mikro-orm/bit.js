const { Type } = require('@mikro-orm/core');
const utils = require('../utils');

class BitType extends Type {
  getColumnType(prop, platform) {
    return utils.bitType(prop.length);
  }
}

module.exports = {BitType};
