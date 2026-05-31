import 'knex';

declare module 'knex' {
  namespace Knex {
    // https://knexjs.org/guide/extending.html
    interface TableBuilder {
      vector(name: string, options: any): Knex.TableBuilder;
      halfvec(name: string, options: any): Knex.TableBuilder;
      sparsevec(name: string, options: any): Knex.TableBuilder;
    }

    // https://knexjs.org/guide/query-builder.html#extending-query-builder
    interface QueryInterface<TRecord extends {} = any, TResult = any> {
      l2Distance(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
      maxInnerProduct(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
      cosineDistance(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
      l1Distance(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
      hammingDistance(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
      jaccardDistance(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
    }
  }
}
