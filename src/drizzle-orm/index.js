const { sql } = require('drizzle-orm');
const { halfvec } = require('./halfvec');
const { vector } = require('./vector');
const utils = require('../utils');

function l2Distance(column, value) {
  return sql`${column} <-> ${utils.toSql(value)}`;
}

function maxInnerProduct(column, value) {
  return sql`${column} <#> ${utils.toSql(value)}`;
}

function cosineDistance(column, value) {
  return sql`${column} <=> ${utils.toSql(value)}`;
}

function l1Distance(column, value) {
  return sql`${column} <+> ${utils.toSql(value)}`;
}

module.exports = {
  vector,
  halfvec,
  l2Distance,
  maxInnerProduct,
  cosineDistance,
  l1Distance
};
