import { SparseVector } from './sparse-vector.js';
declare function fromSql(value: string | null): number[] | SparseVector | null;
declare function toSql(value: number[] | SparseVector | null): string | null;
export { fromSql, toSql, SparseVector };
declare const _default: {
    fromSql: typeof fromSql;
    toSql: typeof toSql;
};
export default _default;
