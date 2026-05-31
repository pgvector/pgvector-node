import { Type } from '@mikro-orm/core';
import { halfvecFromSql, halfvecToSql, halfvecType } from '../utils.js';

export class HalfvecType extends Type {
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return halfvecToSql(value);
  }

  convertToJSValue(value, platform) {
    return halfvecFromSql(value);
  }

  getColumnType(prop, platform) {
    return halfvecType(prop.dimensions);
  }
}
