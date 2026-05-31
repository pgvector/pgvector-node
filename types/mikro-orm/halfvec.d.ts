export class HalfvecType extends Type<number[] | null, string | null> {
    constructor();
    convertToDatabaseValue(value: number[] | null, platform: any): string | null;
    convertToJSValue(value: string, platform: any): number[];
    getColumnType(prop: any, platform: any): string;
}
import { Type } from '@mikro-orm/core';
