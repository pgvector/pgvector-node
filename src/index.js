const util = require('node:util');
const { fromSql, toSql } = require('./utils');

class SparseVector {
  constructor(dimensions, indices, values) {
    this.dimensions = dimensions;
    this.indices = indices;
    this.values = values;
  }

  toString() {
    const values = this.values;
    const elements = this.indices.map((index, i) => util.format('%i:%f', index + 1, values[i])).join(',');
    return util.format('{%s}/%d', elements, this.dimensions);
  }

  static fromDense(value) {
    const dimensions = value.length;
    const indices = value.map((v, i) => [v, i]).filter((v) => v[0] != 0).map((v) => v[1]);
    const values = indices.map((i) => value[i]);
    return new SparseVector(dimensions, indices, values);
  }
}

module.exports = {fromSql, toSql, SparseVector};
