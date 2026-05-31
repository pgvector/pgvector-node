import { format } from 'node:util';

export class SparseVector {
  /** @type {number} */
  dimensions = 0;

  /** @type {number[]} */
  indices = [];

  /** @type {number[]} */
  values = [];

  /**
   * @overload
   * @param {string | number[]} value
   */

  /**
   * @overload
   * @param {Map<number, number> | object} value
   * @param {number} dimensions
   */

  /**
   * @param {string | number[] | Map<number, number> | object} value
   * @param {number} [dimensions]
   */
  constructor(value, dimensions) {
    if (typeof dimensions !== 'undefined') {
      // @ts-ignore
      this.#fromMap(value, dimensions);
    } else if (typeof value === 'string') {
      this.#fromSql(value);
    } else {
      // @ts-ignore
      this.#fromDense(value);
    }
  }

  /**
   * @returns {string}
   */
  toPostgres() {
    const values = this.values;
    const elements = this.indices.map((index, i) => format('%i:%f', index + 1, values[i])).join(',');
    return format('{%s}/%d', elements, this.dimensions);
  }

  /**
   * @returns {string}
   */
  toString() {
    return this.toPostgres();
  }

  /**
   * @returns {number[]}
   */
  toArray() {
    const arr = Array(this.dimensions).fill(0.0);
    for (const [i, index] of this.indices.entries()) {
      arr[index] = this.values[i];
    }
    return arr;
  }

  /**
   * @param {string} value
   */
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

  /**
   * @param {number[]} value
   */
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

  /**
   * @param {Map<number, number>} map
   * @param {number} dimensions
   */
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
