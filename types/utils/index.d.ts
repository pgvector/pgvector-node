export function vectorFromSql(value: any): any;
export function vectorToSql(value: any): any;
export function sparsevecFromSql(value: any): SparseVector;
export function sparsevecToSql(value: any): any;
export function fromSql(value: any): any;
export function toSql(value: any): any;
export function vectorType(dimensions: any): any;
export function halfvecType(dimensions: any): any;
export function bitType(dimensions: any): any;
export function sparsevecType(dimensions: any): any;
export function halfvecFromSql(value: any): any;
export function halfvecToSql(value: any): any;
export function sqlType(dimensions: any): any;
declare namespace _default {
    export { fromSql };
    export { toSql };
    export { sqlType };
}
export default _default;
export { SparseVector };
import { SparseVector } from './sparse-vector.js';
