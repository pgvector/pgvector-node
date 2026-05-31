import { Type } from '@mikro-orm/core';
import { vectorFromSql, vectorToSql, vectorType } from '../utils.js';

/** @import { Platform } from '@mikro-orm/core' */

/**
 * @extends {Type<?number[], ?string>}
 */
export class VectorType extends Type {
  /**
   * @param {?number[]} value
   * @param {Platform} platform
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
   * @param {Platform} platform
   * @return {?number[]}
   */
  convertToJSValue(value, platform) {
    return vectorFromSql(value);
  }

  /**
   * @param {any} prop
   * @param {Platform} platform
   * @return {string}
   */
  getColumnType(prop, platform) {
    return vectorType(prop.dimensions ?? prop.length);
  }
}
