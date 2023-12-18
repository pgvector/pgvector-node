const knex = require('knex');
const { fromSql, toSql, sqlType } = require('../utils');

knex.SchemaBuilder.extend('enableExtension', function(name) {
  return this.raw('CREATE EXTENSION IF NOT EXISTS ??', [name]);
});

knex.TableBuilder.extend('vector', function(name, options) {
  const dimensions = options && (Number.isInteger(options) ? options : options.dimensions);
  return this.specificType(name, sqlType(dimensions));
});

knex.QueryBuilder.extend('l2Distance', function(column, value) {
  return this.client.raw('?? <-> ?', [column, toSql(value)]);
});

knex.QueryBuilder.extend('maxInnerProduct', function(column, value) {
  return this.client.raw('?? <#> ?', [column, toSql(value)]);
});

knex.QueryBuilder.extend('cosineDistance', function(column, value) {
  return this.client.raw('?? <=> ?', [column, toSql(value)]);
});

module.exports = {fromSql, toSql};
