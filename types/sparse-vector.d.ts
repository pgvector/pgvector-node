export class SparseVector {
    constructor(value: any, dimensions: any);
    dimensions: number;
    indices: number[];
    values: number[];
    toPostgres(): string;
    toString(): string;
    toArray(): number[];
    #private;
}
