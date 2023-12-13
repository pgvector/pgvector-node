export class VectorType extends Type<string, string> {
    constructor();
    convertToDatabaseValue(value: any, platform: any): string;
    convertToJSValue(value: any, platform: any): any;
    getColumnType(prop: any, platform: any): string;
}
export function l2Distance(column: any, value: any, em: any): any;
export function maxInnerProduct(column: any, value: any, em: any): any;
export function cosineDistance(column: any, value: any, em: any): any;
import { Type } from "@mikro-orm/core/types";
