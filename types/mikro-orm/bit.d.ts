import { Type } from '@mikro-orm/core';
import type { Platform } from '@mikro-orm/core';
export declare class BitType extends Type {
    getColumnType(prop: any, platform: Platform): string;
}
