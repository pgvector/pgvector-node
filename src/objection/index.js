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

function l1Distance(column, value) {
  return raw('?? <+> ?', [column, toSql(value)]);
}

function hammingDistance(column, value) {
  return raw('?? <~> ?', [column, value]);
}

function jaccardDistance(column, value) {
  return raw('?? <%> ?', [column, value]);
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
