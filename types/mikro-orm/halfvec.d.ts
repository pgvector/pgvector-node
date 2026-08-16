import { Type } from '@mikro-orm/core';
import type { Platform } from '@mikro-orm/core';
export declare class HalfvecType extends Type<number[] | null, string | null> {
    convertToDatabaseValue(value: number[] | null, platform: Platform): string | null;
    convertToJSValue(value: string, platform: Platform): number[] | null;
    getColumnType(prop: any, platform: Platform): string;
}
