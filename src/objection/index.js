const { fromSql, toSql } = require('../knex');
const { raw } = require('objection');

function l2Distance(column, value) {
  return raw('?? <-> ?', [column, toSql(value)]);
}

function maxInnerProduct(column, value) {
  return raw('?? <#> ?', [column, toSql(value)]);
}

function cosineDistance(column, value) {
  return raw('?? <=> ?', [column, toSql(value)]);
}

module.exports = {fromSql, toSql, l2Distance, maxInnerProduct, cosineDistance};
