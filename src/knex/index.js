const knex = require('knex');
const { fromSql, toSql, vectorType, halfvecType, sparsevecType } = require('../utils');

knex.SchemaBuilder.extend('enableExtension', function (name) {
  return this.raw('CREATE EXTENSION IF NOT EXISTS ??', [name]);
});

knex.TableBuilder.extend('vector', function (name, options) {
  const dimensions = options && (Number.isInteger(options) ? options : options.dimensions);
  return this.specificType(name, vectorType(dimensions));
});

knex.TableBuilder.extend('halfvec', function (name, options) {
  const dimensions = options && (Number.isInteger(options) ? options : options.dimensions);
  return this.specificType(name, halfvecType(dimensions));
});

knex.TableBuilder.extend('sparsevec', function (name, options) {
  const dimensions = options && (Number.isInteger(options) ? options : options.dimensions);
  return this.specificType(name, sparsevecType(dimensions));
});

knex.QueryBuilder.extend('l2Distance', function (column, value) {
  return this.client.raw('?? <-> ?', [column, toSql(value)]);
});

knex.QueryBuilder.extend('maxInnerProduct', function (column, value) {
  return this.client.raw('?? <#> ?', [column, toSql(value)]);
});

knex.QueryBuilder.extend('cosineDistance', function (column, value) {
  return this.client.raw('?? <=> ?', [column, toSql(value)]);
});

knex.QueryBuilder.extend('l1Distance', function (column, value) {
  return this.client.raw('?? <+> ?', [column, toSql(value)]);
});

knex.QueryBuilder.extend('hammingDistance', function (column, value) {
  return this.client.raw('?? <~> ?', [column, value]);
});

knex.QueryBuilder.extend('jaccardDistance', function (column, value) {
  return this.client.raw('?? <%> ?', [column, value]);
});

module.exports = {fromSql, toSql};
