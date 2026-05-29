export default VECTOR_TYPE;
declare const VECTOR_TYPE: typeof VECTOR & ((dimensions?: any) => typeof VECTOR);
declare const VECTOR_base: any;
declare class VECTOR extends VECTOR_base {
    [x: string]: any;
    static parse(value: any): any;
    constructor(dimensions: any);
    _dimensions: any;
    toSql(): any;
    _stringify(value: any): any;
    key: string;
}
declare namespace VECTOR {
    let key: string;
}
