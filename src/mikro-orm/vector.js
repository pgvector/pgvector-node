import { Type } from '@mikro-orm/core';
import { vectorFromSql, vectorToSql, vectorType } from '../utils/index.js';

export class VectorType extends Type {
  convertToDatabaseValue(value, platform) {
    if (value === null) {
      return null;
    }
    return vectorToSql(value);
  }

  convertToJSValue(value, platform) {
    if (value === null) {
      return null;
    }
    return vectorFromSql(value);
  }

  getColumnType(prop, platform) {
    return vectorType(prop.dimensions);
  }
}
