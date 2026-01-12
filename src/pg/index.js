import { toSql, vectorFromSql, halfvecFromSql, sparsevecFromSql } from '../utils/index.js';

async function registerTypes(client) {
  const result = await client.query('SELECT typname, oid FROM pg_type WHERE typname IN ($1, $2, $3)', ['vector', 'halfvec', 'sparsevec']);
  const rows = result.rows;

  const vector = rows.find((v) => v.typname == 'vector');
  const halfvec = rows.find((v) => v.typname == 'halfvec');
  const sparsevec = rows.find((v) => v.typname == 'sparsevec');

  if (!vector) {
    throw new Error('vector type not found in the database');
  }

  client.setTypeParser(vector.oid, 'text', function (value) {
    return vectorFromSql(value);
  });

  if (halfvec) {
    client.setTypeParser(halfvec.oid, 'text', function (value) {
      return halfvecFromSql(value);
    });
  }

  if (sparsevec) {
    client.setTypeParser(sparsevec.oid, 'text', function (value) {
      return sparsevecFromSql(value);
    });
  }
}

const registerType = registerTypes;

export default { registerType, registerTypes, toSql };
