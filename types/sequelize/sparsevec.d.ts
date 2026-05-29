export default SPARSEVEC_TYPE;
declare const SPARSEVEC_TYPE: typeof SPARSEVEC & ((dimensions?: any) => typeof SPARSEVEC);
declare const SPARSEVEC_base: any;
declare class SPARSEVEC extends SPARSEVEC_base {
    [x: string]: any;
    static parse(value: any): import("../sparse-vector.js").SparseVector | null;
    constructor(dimensions: any);
    _dimensions: any;
    toSql(): any;
    _stringify(value: any): any;
    key: string;
}
declare namespace SPARSEVEC {
    let key: string;
}
