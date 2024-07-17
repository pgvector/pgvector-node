const { fromSql, toSql } = require('..');
const utils = require('../utils');

async function types(sql) {
  const typeInfo = await sql`SELECT regtype('vector')::oid AS vector, regtype('halfvec')::oid AS halfvec, regtype('sparsevec')::oid AS sparsevec`;

  const vectorOid = typeInfo[0].vector;
  const halfvecOid = typeInfo[0].halfvec;
  const sparsevecOid = typeInfo[0].sparsevec;

  if (!vectorOid) {
    throw new Error('vector type not found in the database');
  }

  const types = {
    vector: {
      to: vectorOid,
      from: [vectorOid],
      serialize: (v) => utils.vectorToSql(v),
      parse: (v) => utils.vectorFromSql(v)
    }
  };

  if (halfvecOid) {
    types['halfvec'] = {
      to: halfvecOid,
      from: [halfvecOid],
      serialize: (v) => utils.halfvecToSql(v),
      parse: (v) => utils.halfvecFromSql(v)
    };
  }

  if (sparsevecOid) {
    types['sparsevec'] = {
        to: sparsevecOid,
        from: [sparsevecOid],
        serialize: (v) => utils.sparsevecToSql(v),
        parse: (v) => utils.sparsevecFromSql(v)
    };
  }

  return types;
}

module.exports = {types, fromSql, toSql};
