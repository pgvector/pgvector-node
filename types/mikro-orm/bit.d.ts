export class BitType extends Type<string, string> {
    constructor();
    getColumnType(prop: any, platform: any): string;
}
import { Type } from '@mikro-orm/core';
