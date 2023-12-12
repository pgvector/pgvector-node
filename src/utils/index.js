const util = require('util');

function fromSql(value) {
  return value.substring(1, value.length - 1).split(',').map((v) => parseFloat(v));
}

function toSql(value) {
  return JSON.stringify(value);
}

function sqlType(dimensions) {
  if (dimensions === undefined || dimensions === null) {
    return 'vector';
  }

  if (!Number.isInteger(dimensions)) {
    throw new Error('expected integer');
  }

  return util.format('vector(%d)', dimensions);
}

module.exports = {fromSql, toSql, sqlType};
