import { format } from 'node:util';

export class SparseVector {
  constructor(value, dimensions) {
    this.indices = [];
    this.values = [];

    if (typeof value === 'string') {
      this.#fromSql(value);
    } else if (dimensions !== undefined) {
      this.#fromMap(value, dimensions);
    } else {
      this.#fromDense(value);
    }
  }

  toPostgres() {
    const values = this.values;
    const elements = this.indices.map((index, i) => format('%i:%f', index + 1, values[i])).join(',');
    return format('{%s}/%d', elements, this.dimensions);
  }

  toString() {
    return this.toPostgres();
  }

  toArray() {
    const arr = Array(this.dimensions).fill(0.0);
    for (const [i, index] of this.indices.entries()) {
      arr[index] = this.values[i];
    }
    return arr;
  }

  #fromSql(value) {
    const parts = value.split('/', 2);

    this.dimensions = parseInt(parts[1]);

    const elements = parts[0].slice(1, -1).split(',');
    for (const element of elements) {
      const ep = element.split(':', 2);
      this.indices.push(parseInt(ep[0]) - 1);
      this.values.push(parseFloat(ep[1]));
    }
  }

  #fromDense(value) {
    this.dimensions = value.length;

    for (const [i, v] of value.entries()) {
      const f = Number(v);
      if (f != 0) {
        this.indices.push(Number(i));
        this.values.push(f);
      }
    }
  }

  #fromMap(map, dimensions) {
    this.dimensions = Number(dimensions);

    const entries = map instanceof Map ? map.entries() : Object.entries(map);
    for (const [i, v] of entries) {
      const f = Number(v);
      if (f != 0) {
        this.indices.push(Number(i));
        this.values.push(f);
      }
    }
  }
}
