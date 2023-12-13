const { sql } = require('kysely');
const { vector } = require('..');

function l2Distance(column, value) {
  return sql`${sql.ref(column)} <-> ${vector(value)}`;
}

function maxInnerProduct(column, value) {
  return sql`${sql.ref(column)} <#> ${vector(value)}`;
}

function cosineDistance(column, value) {
  return sql`${sql.ref(column)} <=> ${vector(value)}`;
}

module.exports = {vector, l2Distance, maxInnerProduct, cosineDistance};
