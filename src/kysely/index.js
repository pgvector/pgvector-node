const { sql } = require('kysely');
const { fromSql, toSql } = require('..');
const { anyToSql } = require('../utils');

function l2Distance(column, value) {
  return sql`${sql.ref(column)} <-> ${anyToSql(value)}`;
}

function maxInnerProduct(column, value) {
  return sql`${sql.ref(column)} <#> ${anyToSql(value)}`;
}

function cosineDistance(column, value) {
  return sql`${sql.ref(column)} <=> ${anyToSql(value)}`;
}

function l1Distance(column, value) {
  return sql`${sql.ref(column)} <+> ${anyToSql(value)}`;
}

function hammingDistance(column, value) {
  return sql`${sql.ref(column)} <~> ${value}`;
}

function jaccardDistance(column, value) {
  return sql`${sql.ref(column)} <%> ${value}`;
}

module.exports = {
  fromSql,
  toSql,
  l2Distance,
  maxInnerProduct,
  cosineDistance,
  l1Distance,
  hammingDistance,
  jaccardDistance
};
