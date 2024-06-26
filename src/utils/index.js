const util = require('node:util');
const { SparseVector } = require('./sparse-vector');

function fromSql(value) {
  if (value === null) {
    return null;
  }
  return value.substring(1, value.length - 1).split(',').map((v) => parseFloat(v));
}

function toSql(value) {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  return value;
}

const vectorFromSql = fromSql;
const vectorToSql = toSql;

const halfvecFromSql = fromSql;
const halfvecToSql = toSql;

function sparsevecFromSql(value) {
  if (value === null) {
    return null;
  }
  return new SparseVector(value);
}

function sparsevecToSql(value) {
  if (value instanceof SparseVector) {
    return value.toSql();
  }
  return value;
}

function anyToSql(value) {
  if (Array.isArray(value)) {
    return toSql(value);
  }
  if (value instanceof SparseVector) {
    return value.toSql();
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

module.exports = {
  fromSql,
  toSql,
  vectorFromSql,
  vectorToSql,
  halfvecFromSql,
  halfvecToSql,
  sparsevecFromSql,
  sparsevecToSql,
  anyToSql,
  sqlType,
  vectorType,
  halfvecType,
  bitType,
  sparsevecType,
  SparseVector
};
