import { Type } from '@mikro-orm/core';
import { halfvecFromSql, halfvecToSql, halfvecType } from '../utils.js';

/**
 * @extends {Type<?number[], ?string>}
 */
export class HalfvecType extends Type {
  /**
   * @param {?number[]} value
   * @return {?string}
   */
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return halfvecToSql(value);
  }

  /**
   * @param {string} value
   * @return {number[]}
   */
  convertToJSValue(value, platform) {
    return halfvecFromSql(value);
  }

  /**
   * @return {string}
   */
  getColumnType(prop, platform) {
    return halfvecType(prop.dimensions);
  }
}
