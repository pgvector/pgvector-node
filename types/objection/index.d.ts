export function l2Distance(column: any, value: number[] | SparseVector | null): import("objection").RawBuilder;
export function maxInnerProduct(column: any, value: number[] | SparseVector | null): import("objection").RawBuilder;
export function cosineDistance(column: any, value: number[] | SparseVector | null): import("objection").RawBuilder;
export function l1Distance(column: any, value: number[] | SparseVector | null): import("objection").RawBuilder;
export function hammingDistance(column: any, value: string): import("objection").RawBuilder;
export function jaccardDistance(column: any, value: string): import("objection").RawBuilder;
declare namespace _default {
    export { fromSql };
    export { toSql };
}
export default _default;
import type { SparseVector } from '../index.js';
import { fromSql } from '../index.js';
import { toSql } from '../index.js';
export { fromSql, toSql };
