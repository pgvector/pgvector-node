import { Type } from '@mikro-orm/core';
import { bitType } from '../utils/index.js';

class BitType extends Type {
  getColumnType(prop, platform) {
    return bitType(prop.length);
  }
}

export { BitType };
