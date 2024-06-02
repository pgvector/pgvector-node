export class SparseVector {
    static fromSql(value: any): SparseVector;
    static fromDense(value: any): SparseVector;
    constructor(dimensions: any, indices: any, values: any);
    dimensions: any;
    indices: any;
    values: any;
    toString(): string;
    toSql(): string;
    toArray(): any[];
}
