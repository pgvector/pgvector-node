import { Type } from '@mikro-orm/core';
import { halfvecFromSql, halfvecToSql, halfvecType } from '../utils.js';

/** @import { Platform } from '@mikro-orm/core' */

/**
 * @extends {Type<?number[], ?string>}
 */
export class HalfvecType extends Type {
  /**
   * @param {?number[]} value
   * @param {Platform} platform
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
   * @param {Platform} platform
   * @return {?number[]}
   */
  convertToJSValue(value, platform) {
    return halfvecFromSql(value);
  }

  /**
   * @param {any} prop
   * @param {Platform} platform
   * @return {string}
   */
  getColumnType(prop, platform) {
    return halfvecType(prop.dimensions ?? prop.length);
  }
}
