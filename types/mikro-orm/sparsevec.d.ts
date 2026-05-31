export class SparsevecType extends Type<SparseVector | null, string | null> {
    constructor();
    convertToDatabaseValue(value: any, platform: Platform): string | null;
    convertToJSValue(value: string, platform: Platform): SparseVector | null;
    getColumnType(prop: any, platform: Platform): string;
}
import type { SparseVector } from '../index.js';
import { Type } from '@mikro-orm/core';
import type { Platform } from '@mikro-orm/core';
