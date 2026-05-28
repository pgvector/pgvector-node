export class SparseVector {
    constructor(value: any, dimensions: any);
    toPostgres(): string;
    toString(): string;
    toArray(): any[];
    dimensions: any;
    indices: any[] | undefined;
    values: any[] | undefined;
    #private;
}
