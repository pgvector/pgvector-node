export declare class SparseVector {
    #private;
    dimensions: number;
    indices: number[];
    values: number[];
    constructor(value: string | number[]);
    constructor(value: Map<number, number> | object, dimensions: number);
    toPostgres(): string;
    toString(): string;
    toArray(): number[];
}
