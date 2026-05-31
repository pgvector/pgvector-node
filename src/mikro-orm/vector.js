import { Type } from '@mikro-orm/core';
import { vectorFromSql, vectorToSql, vectorType } from '../utils.js';

/**
 * @extends {Type<?number[], ?string>}
 */
export class VectorType extends Type {
  /**
   * @param {?number[]} value
   * @return {?string}
   */
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return vectorToSql(value);
  }

  /**
   * @param {string} value
   * @return {number[]}
   */
  convertToJSValue(value, platform) {
    return vectorFromSql(value);
  }

  /**
   * @return {string}
   */
  getColumnType(prop, platform) {
    return vectorType(prop.dimensions);
  }
}
