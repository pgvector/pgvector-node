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

module.exports = {fromSql, toSql, l2Distance, maxInnerProduct, cosineDistance};
