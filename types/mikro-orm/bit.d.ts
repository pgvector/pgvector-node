export class BitType extends Type<string, string> {
    constructor();
    getColumnType(prop: any, platform: Platform): string;
}
import { Type } from '@mikro-orm/core';
import type { Platform } from '@mikro-orm/core';
