import { sql } from 'kysely';
import { fromSql, toSql } from '../utils/index.js';

export default { fromSql, toSql };

export function l2Distance(column, value) {
  return sql`${sql.ref(column)} <-> ${toSql(value)}`;
}

export function maxInnerProduct(column, value) {
  return sql`${sql.ref(column)} <#> ${toSql(value)}`;
}

export function cosineDistance(column, value) {
  return sql`${sql.ref(column)} <=> ${toSql(value)}`;
}

export function l1Distance(column, value) {
  return sql`${sql.ref(column)} <+> ${toSql(value)}`;
}

export function hammingDistance(column, value) {
  return sql`${sql.ref(column)} <~> ${value}`;
}

export function jaccardDistance(column, value) {
  return sql`${sql.ref(column)} <%> ${value}`;
}
