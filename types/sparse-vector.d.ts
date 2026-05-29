export class SparseVector {
    constructor(value: any, dimensions: any);
    indices: any[];
    values: any[];
    toPostgres(): string;
    toString(): string;
    toArray(): any[];
    dimensions: any;
    #private;
}
