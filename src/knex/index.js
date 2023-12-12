const knex = require('knex');
const util = require('util');
const { fromSql, toSql, sqlType } = require('../utils');

knex.TableBuilder.extend('vector', function(name, options) {
  const dimensions = options && options.dimensions;
  return this.specificType(name, sqlType(dimensions));
});

module.exports = {fromSql, toSql};
