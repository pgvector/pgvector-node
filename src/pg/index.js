const utils = require('../utils');

async function registerType(client) {
  const result = await client.query('SELECT typname, oid FROM pg_type WHERE typname IN ($1, $2)', ['vector', 'halfvec']);
  const vector = result.rows.find((v) => v.typname == 'vector');
  const halfvec = result.rows.find((v) => v.typname == 'halfvec');

  if (!vector) {
    throw new Error('vector type not found in the database');
  }

  client.setTypeParser(vector.oid, 'text', function(value) {
    return utils.fromSql(value);
  });

  if (halfvec) {
    client.setTypeParser(halfvec.oid, 'text', function(value) {
      return utils.fromSql(value);
    });
  }
}

function toSql(value) {
  if (!Array.isArray(value)) {
    throw new Error('expected array');
  }
  return utils.toSql(value);
}

module.exports = {registerType, toSql};
