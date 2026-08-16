import { fromSql, toSql } from '../index.js';
import type { SparseVector } from '../index.js';
export declare function l2Distance(column: any, value: number[] | SparseVector | null): import("kysely").RawBuilder<unknown>;
export declare function maxInnerProduct(column: any, value: number[] | SparseVector | null): import("kysely").RawBuilder<unknown>;
export declare function cosineDistance(column: any, value: number[] | SparseVector | null): import("kysely").RawBuilder<unknown>;
export declare function l1Distance(column: any, value: number[] | SparseVector | null): import("kysely").RawBuilder<unknown>;
export declare function hammingDistance(column: any, value: string): import("kysely").RawBuilder<unknown>;
export declare function jaccardDistance(column: any, value: string): import("kysely").RawBuilder<unknown>;
export { fromSql, toSql };
declare const _default: {
    fromSql: typeof fromSql;
    toSql: typeof toSql;
};
export default _default;
