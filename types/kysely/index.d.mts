import type { RawBuilder } from "kysely";
import { fromSql } from "..";
import { toSql } from "..";

export function l2Distance(column: any, value: any): RawBuilder<unknown>;
export function maxInnerProduct(column: any, value: any): RawBuilder<unknown>;
export function cosineDistance(column: any, value: any): RawBuilder<unknown>;
export function l1Distance(column: any, value: any): RawBuilder<unknown>;
export function hammingDistance(column: any, value: any): RawBuilder<unknown>;
export function jaccardDistance(column: any, value: any): RawBuilder<unknown>;
export { fromSql, toSql };
