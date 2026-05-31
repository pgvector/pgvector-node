export class SparsevecType extends Type<string, string> {
    constructor();
    convertToDatabaseValue(value: any, platform: any): string | null;
    convertToJSValue(value: any, platform: any): import("../sparse-vector.js").SparseVector | null;
    getColumnType(prop: any, platform: any): string;
}
import { Type } from '@mikro-orm/core';
