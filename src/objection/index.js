const { fromSql, toSql } = require('../knex');
const { raw } = require('objection');
const { anyToSql } = require('../utils');

function l2Distance(column, value) {
  return raw('?? <-> ?', [column, anyToSql(value)]);
}

function maxInnerProduct(column, value) {
  return raw('?? <#> ?', [column, anyToSql(value)]);
}

function cosineDistance(column, value) {
  return raw('?? <=> ?', [column, anyToSql(value)]);
}

function l1Distance(column, value) {
  return raw('?? <+> ?', [column, anyToSql(value)]);
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
