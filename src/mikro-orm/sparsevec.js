import { Type } from '@mikro-orm/core';
import { sparsevecFromSql, sparsevecToSql, sparsevecType } from '../utils.js';

/** @import { Platform } from '@mikro-orm/core' */
/** @import { SparseVector } from '../index.js' */

/**
 * @extends {Type<?SparseVector, ?string>}
 */
export class SparsevecType extends Type {
  /**
   * @param {any} value
   * @param {Platform} platform
   * @return {?string}
   */
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return sparsevecToSql(value);
  }

  /**
   * @param {string} value
   * @param {Platform} platform
   * @return {?SparseVector}
   */
  convertToJSValue(value, platform) {
    return sparsevecFromSql(value);
  }

  /**
   * @param {any} prop
   * @param {Platform} platform
   * @return {string}
   */
  getColumnType(prop, platform) {
    return sparsevecType(prop.dimensions ?? prop.length);
  }
}
