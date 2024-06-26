export class SparseVector {
    static fromSql(value: any): SparseVector;
    static fromDense(value: any): SparseVector;
    static fromMap(map: any, dimensions: any): SparseVector;
    constructor(dimensions: any, indices: any, values: any);
    dimensions: any;
    indices: any;
    values: any;
    toString(): string;
    toSql(): string;
    toPostgres(): string;
    toArray(): any[];
}
