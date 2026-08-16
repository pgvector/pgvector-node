import { Type } from '@mikro-orm/core';
import type { Platform } from '@mikro-orm/core';
import type { SparseVector } from '../index.js';
export declare class SparsevecType extends Type<SparseVector | null, string | null> {
    convertToDatabaseValue(value: any, platform: Platform): string | null;
    convertToJSValue(value: string, platform: Platform): SparseVector | null;
    getColumnType(prop: any, platform: Platform): string;
}
