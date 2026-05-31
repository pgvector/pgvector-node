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
    interface QueryInterface {
      l2Distance<TRecord, TResult>(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
      maxInnerProduct<TRecord, TResult>(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
      cosineDistance<TRecord, TResult>(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
      l1Distance<TRecord, TResult>(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
      hammingDistance<TRecord, TResult>(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
      jaccardDistance<TRecord, TResult>(column: any, value: any): Knex.QueryBuilder<TRecord, TResult>;
    }
  }
}
