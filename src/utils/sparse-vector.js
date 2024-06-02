const util = require('node:util');

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

  toSql() {
    return this.toString();
  }

  toArray() {
    const arr = Array(this.dimensions).fill(0.0);
    for (const [i, index] of this.indices.entries()) {
      arr[index] = this.values[i];
    }
    return arr;
  }

  static fromSql(value) {
    const parts = value.split('/', 2);
    const elements = parts[0].slice(1, -1).split(',');
    const dimensions = parseInt(parts[1]);
    const indices = [];
    const values = [];
    for (const element of elements) {
      const ep = element.split(':', 2);
      indices.push(parseInt(ep[0]) - 1);
      values.push(parseFloat(ep[1]));
    }
    return new SparseVector(dimensions, indices, values);
  }

  static fromDense(value) {
    const dimensions = value.length;
    const indices = value.map((v, i) => [v, i]).filter((v) => v[0] != 0).map((v) => v[1]);
    const values = indices.map((i) => value[i]);
    return new SparseVector(dimensions, indices, values);
  }
}

module.exports = {SparseVector};
