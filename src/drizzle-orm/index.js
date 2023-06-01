const { sql } = require('drizzle-orm');
const { customType } = require('drizzle-orm/pg-core');
const util = require('util');
const utils = require('../utils');

const vector = customType({
  dataType(config) {
    const dimensions = config && config.dimensions;
    if (typeof dimensions === 'undefined') {
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

function l2Distance(column, value) {
  return sql`${column} <-> ${utils.toSql(value)}`;
}

function maxInnerProduct(column, value) {
  return sql`${column} <#> ${utils.toSql(value)}`;
}

function cosineDistance(column, value) {
  return sql`${column} <=> ${utils.toSql(value)}`;
}

module.exports = {
  vector,
  l2Distance,
  maxInnerProduct,
  cosineDistance
};
