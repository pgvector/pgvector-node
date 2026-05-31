/// <reference path="./index.d.ts" preserve="true" />

import knex from 'knex';
import { deprecate } from 'node:util';
import { fromSql, toSql } from '../index.js';
import { vectorType, halfvecType, sparsevecType } from '../utils.js';

// @ts-ignore
knex.SchemaBuilder.extend('enableExtension', deprecate(function (name) {
  return this.raw('CREATE EXTENSION IF NOT EXISTS ??', [name]);
}, 'enableExtension() is deprecated. Use createExtensionIfNotExists() instead.'));

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

export { fromSql, toSql };

export default { fromSql, toSql };
