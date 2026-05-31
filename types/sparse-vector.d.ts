export class SparseVector {
    constructor(value: string | number[]);
    constructor(value: Map<number, number>, dimensions: number);
    dimensions: number;
    indices: number[];
    values: number[];
    toPostgres(): string;
    toString(): string;
    toArray(): number[];
    #private;
}
