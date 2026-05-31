import { Type } from '@mikro-orm/core';
import { sparsevecFromSql, sparsevecToSql, sparsevecType } from '../utils.js';

export class SparsevecType extends Type {
  // @ts-ignore
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

  /**
   * @return {string}
   */
  getColumnType(prop, platform) {
    return sparsevecType(prop.dimensions);
  }
}
