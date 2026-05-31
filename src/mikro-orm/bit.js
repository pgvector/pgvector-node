import { Type } from '@mikro-orm/core';
import { bitType } from '../utils.js';

/** @import { Platform } from '@mikro-orm/core' */

export class BitType extends Type {
  /**
   * @param {Platform} platform
   * @return {string}
   */
  getColumnType(prop, platform) {
    return bitType(prop.length);
  }
}
