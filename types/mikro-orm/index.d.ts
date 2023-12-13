export class Vector extends Type<string, string> {
    constructor();
    convertToDatabaseValue(value: any, platform: any): string;
    convertToJSValue(value: any, platform: any): any;
    getColumnType(prop: any, platform: any): string;
}
import { Type } from "@mikro-orm/core/types";
