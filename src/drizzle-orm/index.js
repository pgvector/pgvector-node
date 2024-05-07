const { sql } = require('drizzle-orm');
const { bit } = require('./bit');
const { halfvec } = require('./halfvec');
const { sparsevec } = require('./sparsevec');
const { vector } = require('./vector');
const { anyToSql } = require('../utils');

function l2Distance(column, value) {
  return sql`${column} <-> ${anyToSql(value)}`;
}

function maxInnerProduct(column, value) {
  return sql`${column} <#> ${anyToSql(value)}`;
}

function cosineDistance(column, value) {
  return sql`${column} <=> ${anyToSql(value)}`;
}

function l1Distance(column, value) {
  return sql`${column} <+> ${anyToSql(value)}`;
}

function hammingDistance(column, value) {
  return sql`${column} <~> ${value}`;
}

function jaccardDistance(column, value) {
  return sql`${column} <%> ${value}`;
}

module.exports = {
  vector,
  halfvec,
  bit,
  sparsevec,
  l2Distance,
  maxInnerProduct,
  cosineDistance,
  l1Distance,
  hammingDistance,
  jaccardDistance
};
