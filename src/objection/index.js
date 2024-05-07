const { fromSql, toSql } = require('../knex');
const { raw } = require('objection');
const { toAnySql } = require('../utils');

function l2Distance(column, value) {
  return raw('?? <-> ?', [column, toAnySql(value)]);
}

function maxInnerProduct(column, value) {
  return raw('?? <#> ?', [column, toAnySql(value)]);
}

function cosineDistance(column, value) {
  return raw('?? <=> ?', [column, toAnySql(value)]);
}

function l1Distance(column, value) {
  return raw('?? <+> ?', [column, toAnySql(value)]);
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
