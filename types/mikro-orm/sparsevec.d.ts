export class SparsevecType extends Type<string, string> {
    constructor();
    convertToDatabaseValue(value: any, platform: any): any;
    convertToJSValue(value: any, platform: any): import("../utils/sparse-vector.js").SparseVector;
    getColumnType(prop: any, platform: any): any;
}
import { Type } from '@mikro-orm/core';
