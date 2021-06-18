const utils = require('../utils');

async function registerType(client) {
  const result = await client.query('SELECT typname, oid, typarray FROM pg_type WHERE typname = $1', ['vector']);
  if (result.rowCount < 1) {
    throw new Error('vector type not found in the database');
  }
  const oid = result.rows[0].oid;
  client.setTypeParser(oid, 'text', function(value) {
    return utils.fromSql(value);
  });
}

function toSql(value) {
  if (!Array.isArray(value)) {
    throw new Error('expected array');
  }
  return utils.toSql(value);
}

module.exports = {registerType, toSql};
