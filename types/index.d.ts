declare namespace _default {
    export { fromSql };
    export { toSql };
}
export default _default;
export function fromSql(value: string | null): number[] | SparseVector | null;
export function toSql(value: number[] | SparseVector | null): string | null;
import { SparseVector } from './sparse-vector.js';
export { SparseVector };
