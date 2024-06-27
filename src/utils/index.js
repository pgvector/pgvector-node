const util = require('node:util');
const { SparseVector } = require('./sparse-vector');

function vectorFromSql(value) {
  if (value === null) {
    return null;
  }
  return value.substring(1, value.length - 1).split(',').map((v) => parseFloat(v));
}

function vectorToSql(value) {
  if (Array.isArray(value)) {
    return JSON.stringify(value.map((v) => Number(v)));
  }
  return value;
}

const halfvecFromSql = vectorFromSql;
const halfvecToSql = vectorToSql;

function sparsevecFromSql(value) {
  if (value === null) {
    return null;
  }
  return new SparseVector(value);
}

function sparsevecToSql(value) {
  if (value instanceof SparseVector) {
    return value.toPostgres();
  }
  return value;
}

function fromSql(value) {
  if (value === null) {
    return null;
  } else if (value[0] == '[') {
    return vectorFromSql(value);
  } else if (value[0] == '{') {
    return sparsevecFromSql(value);
  } else {
    throw new Error('invalid text representation');
  }
}

function toSql(value) {
  if (value === null) {
    return null;
  } else if (Array.isArray(value)) {
    return vectorToSql(value);
  } else if (value instanceof SparseVector) {
    return sparsevecToSql(value);
  } else {
    throw new Error('expected array or sparse vector');
  }
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
  sqlType,
  vectorType,
  halfvecType,
  bitType,
  sparsevecType,
  SparseVector
};
