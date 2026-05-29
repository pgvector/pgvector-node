export class SparsevecType extends Type<string, string> {
    constructor();
    convertToDatabaseValue(value: any, platform: any): any;
    convertToJSValue(value: any, platform: any): import("../sparse-vector.js").SparseVector | null;
    getColumnType(prop: any, platform: any): any;
}
import { Type } from '@mikro-orm/core';
