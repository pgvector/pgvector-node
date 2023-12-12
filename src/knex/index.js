const knex = require('knex');
const util = require('util');
const { fromSql, toSql, sqlType } = require('../utils');

knex.SchemaBuilder.extend('enableVectorExtension', function() {
  return this.raw('CREATE EXTENSION IF NOT EXISTS vector');
});

knex.TableBuilder.extend('vector', function(name, options) {
  const dimensions = options && options.dimensions;
  return this.specificType(name, sqlType(dimensions));
});

module.exports = {fromSql, toSql};
