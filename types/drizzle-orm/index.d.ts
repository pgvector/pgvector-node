export const vector: <TName extends string>(dbName: TName, fieldConfig?: unknown) => import("drizzle-orm/pg-core").PgCustomColumnBuilder<{
    name: TName;
    data: unknown;
    driverParam: unknown;
    notNull: false;
    hasDefault: false;
}>;
