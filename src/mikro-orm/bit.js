import { Type } from '@mikro-orm/core';
import { bitType } from '../utils.js';

export class BitType extends Type {
  getColumnType(prop, platform) {
    return bitType(prop.length);
  }
}
