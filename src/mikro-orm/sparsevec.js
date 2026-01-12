import { Type } from '@mikro-orm/core';
import { sparsevecFromSql, sparsevecToSql, sparsevecType } from '../utils/index.js';

export class SparsevecType extends Type {
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return sparsevecToSql(value);
  }

  convertToJSValue(value, platform) {
    if (value === null) {
      return null;
    }
    return sparsevecFromSql(value);
  }

  getColumnType(prop, platform) {
    return sparsevecType(prop.dimensions);
  }
}
