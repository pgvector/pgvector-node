import { Type } from '@mikro-orm/core';
import { vectorFromSql, vectorToSql, vectorType } from '../utils.js';

export class VectorType extends Type {
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return vectorToSql(value);
  }

  convertToJSValue(value, platform) {
    return vectorFromSql(value);
  }

  getColumnType(prop, platform) {
    return vectorType(prop.dimensions);
  }
}
