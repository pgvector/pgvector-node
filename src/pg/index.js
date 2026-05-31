import { deprecate } from 'node:util';
import { toSql } from '../index.js';
import { vectorFromSql, halfvecFromSql, sparsevecFromSql } from '../utils.js';

/** @import { ClientBase } from 'pg' */

/**
 * @param {ClientBase} client
 */
async function registerTypes(client) {
  const result = await client.query('SELECT typname, oid FROM pg_type WHERE typname IN ($1, $2, $3)', ['vector', 'halfvec', 'sparsevec']);
  const rows = result.rows;

  const vector = rows.find(/** @type {function(any): any} */ (v) => v.typname == 'vector');
  const halfvec = rows.find(/** @type {function(any): any} */ (v) => v.typname == 'halfvec');
  const sparsevec = rows.find(/** @type {function(any): any} */ (v) => v.typname == 'sparsevec');

  if (!vector) {
    throw new Error('vector type not found in the database');
  }

  client.setTypeParser(vector.oid, 'text', /** @type {function(any): any} */ function (value) {
    return vectorFromSql(value);
  });

  if (halfvec) {
    client.setTypeParser(halfvec.oid, 'text', /** @type {function(any): any} */ function (value) {
      return halfvecFromSql(value);
    });
  }

  if (sparsevec) {
    client.setTypeParser(sparsevec.oid, 'text', /** @type {function(any): any} */ function (value) {
      return sparsevecFromSql(value);
    });
  }
}

const registerType = deprecate(registerTypes, 'registerType() is deprecated. Use registerTypes() instead.');

export { registerType, registerTypes, toSql };

export default { registerType, registerTypes, toSql };
