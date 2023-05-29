export const vector: <TName extends string>(dbName: TName, fieldConfig?: unknown) => import("drizzle-orm/pg-core").PgCustomColumnBuilder<{
    name: TName;
    data: unknown;
    driverParam: unknown;
    notNull: false;
    hasDefault: false;
}>;
export function l2Distance(column: any, value: any): import("drizzle-orm/column.d-c31e7ad3").S<any>;
export function maxInnerProduct(column: any, value: any): import("drizzle-orm/column.d-c31e7ad3").S<any>;
export function cosineDistance(column: any, value: any): import("drizzle-orm/column.d-c31e7ad3").S<any>;
