export function vector(vec: any): Vector;
declare class Vector {
    constructor(vec: any);
    vec: any;
    toArray(): any;
    toPostgres(): string;
    toString(): string;
}
export {};
