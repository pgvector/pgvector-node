import { vectorFromSql, vectorToSql, halfvecFromSql, halfvecToSql, sparsevecFromSql, sparsevecToSql } from '../utils.js';

export const pgvectorTypes = {
  vector: {
    to: 'vector',
    from: ['vector'],
    serialize: vectorToSql,
    parse: vectorFromSql
  },
  halfvec: {
    to: 'halfvec',
    from: ['halfvec'],
    serialize: halfvecToSql,
    parse: halfvecFromSql
  },
  sparsevec: {
    to: 'sparsevec',
    from: ['sparsevec'],
    serialize: sparsevecToSql,
    parse: sparsevecFromSql
  }
};
