const { customType } = require('drizzle-orm/pg-core');
const util = require('util');
const utils = require('../utils');

const vector = customType({
  dataType(config) {
    const dimensions = config.dimensions;
    if (dimensions === undefined) {
      return 'vector';
    }
    return util.format('vector(%d)', dimensions);
  },
  toDriver(value) {
    return utils.toSql(value);
  },
  fromDriver(value) {
    return utils.fromSql(value);
  }
});

module.exports = {vector};
