export function types(sql: any): Promise<{
    vector: {
        to: any;
        from: any[];
        serialize: (v: any) => any;
        parse: (v: any) => any;
    };
}>;
import { fromSql } from "..";
import { toSql } from "..";
export { fromSql, toSql };
