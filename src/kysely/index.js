const { sql } = require('kysely');
const { fromSql, toSql } = require('..');

function l2Distance(column, value) {
  return sql`${sql.ref(column)} <-> ${toSql(value)}`;
}

function maxInnerProduct(column, value) {
  return sql`${sql.ref(column)} <#> ${toSql(value)}`;
}

function cosineDistance(column, value) {
  return sql`${sql.ref(column)} <=> ${toSql(value)}`;
}

function l1Distance(column, value) {
  return sql`${sql.ref(column)} <+> ${toSql(value)}`;
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
