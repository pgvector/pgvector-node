import 'knex';

declare module 'knex' {
  namespace Knex {
    interface TableBuilder {
      vector(name: string, options: any): Knex.TableBuilder;
      halfvec(name: string, options: any): Knex.TableBuilder;
      sparsevec(name: string, options: any): Knex.TableBuilder;
    }
  }
}
