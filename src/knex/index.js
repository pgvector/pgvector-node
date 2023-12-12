const knex = require('knex');
const util = require('util');
const { fromSql, toSql } = require('../utils');

knex.TableBuilder.extend('vector', function(name, options) {
  const dimensions = options && options.dimensions;
  const type = dimensions !== undefined ? util.format('vector(%d)', dimensions) : 'vector';
  return this.specificType(name, type);
});

module.exports = {fromSql, toSql};
