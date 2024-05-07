const util = require('node:util');

function fromSql(value) {
  return value.substring(1, value.length - 1).split(',').map((v) => parseFloat(v));
}

function toSql(value) {
  return JSON.stringify(value);
}

// TODO
function fromSparseSql(value) {
  return value;
}

// TODO
function toSparseSql(value) {
  return value;
}

function toAnySql(value) {
  if (Array.isArray(value)) {
    return toSql(value);
  }
  return value;
}

function typeWithDimensions(name, dimensions) {
  if (dimensions === undefined || dimensions === null) {
    return name;
  }

  if (!Number.isInteger(dimensions)) {
    throw new Error('expected integer');
  }

  return util.format('%s(%d)', name, dimensions);
}

function vectorType(dimensions) {
  return typeWithDimensions('vector', dimensions);
}

function halfvecType(dimensions) {
  return typeWithDimensions('halfvec', dimensions);
}

function bitType(dimensions) {
  return typeWithDimensions('bit', dimensions);
}

function sparsevecType(dimensions) {
  return typeWithDimensions('sparsevec', dimensions);
}

// for backwards compatibility
const sqlType = vectorType;

module.exports = {fromSql, toSql, fromSparseSql, toSparseSql, toAnySql, sqlType, vectorType, halfvecType, bitType, sparsevecType};
