import { Type } from '@mikro-orm/core';
import { sparsevecFromSql, sparsevecToSql, sparsevecType } from '../utils.js';

export class SparsevecType extends Type {
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return sparsevecToSql(value);
  }

  // @ts-ignore
  convertToJSValue(value, platform) {
    return sparsevecFromSql(value);
  }

  getColumnType(prop, platform) {
    return sparsevecType(prop.dimensions);
  }
}
