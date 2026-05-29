export default HALFVEC_TYPE;
declare const HALFVEC_TYPE: typeof HALFVEC & ((dimensions?: any) => typeof HALFVEC);
declare const HALFVEC_base: any;
declare class HALFVEC extends HALFVEC_base {
    [x: string]: any;
    static parse(value: any): any;
    constructor(dimensions: any);
    _dimensions: any;
    toSql(): any;
    _stringify(value: any): any;
    key: string;
}
declare namespace HALFVEC {
    let key: string;
}
