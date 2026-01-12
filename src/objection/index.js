import { fromSql, toSql } from '../utils/index.js';
import { raw } from 'objection';
import '../knex/index.js';

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

export default {
  fromSql,
  toSql
};

export {
  l2Distance,
  maxInnerProduct,
  cosineDistance,
  l1Distance,
  hammingDistance,
  jaccardDistance
};
