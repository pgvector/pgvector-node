import { fromSql, toSql } from '../utils/index.js';
import { raw } from 'objection';
import '../knex/index.js';

export function l2Distance(column, value) {
  return raw('?? <-> ?', [column, toSql(value)]);
}

export function maxInnerProduct(column, value) {
  return raw('?? <#> ?', [column, toSql(value)]);
}

export function cosineDistance(column, value) {
  return raw('?? <=> ?', [column, toSql(value)]);
}

export function l1Distance(column, value) {
  return raw('?? <+> ?', [column, toSql(value)]);
}

export function hammingDistance(column, value) {
  return raw('?? <~> ?', [column, value]);
}

export function jaccardDistance(column, value) {
  return raw('?? <%> ?', [column, value]);
}

export default {
  fromSql,
  toSql
};
