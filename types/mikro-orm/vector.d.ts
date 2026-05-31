export class VectorType extends Type<string, string> {
    constructor();
    convertToDatabaseValue(value: any, platform: any): any;
    convertToJSValue(value: any, platform: any): any;
    getColumnType(prop: any, platform: any): string;
}
import { Type } from '@mikro-orm/core';
