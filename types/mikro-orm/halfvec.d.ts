export class HalfvecType extends Type<string, string> {
    constructor();
    convertToDatabaseValue(value: any, platform: any): any;
    convertToJSValue(value: any, platform: any): any;
    getColumnType(prop: any, platform: any): any;
}
import { Type } from "@mikro-orm/core/types";
