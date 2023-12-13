const utils = require('./utils');

class Vector {
  constructor(vec) {
    if (Array.isArray(vec)) {
      this.vec = vec;
    } else {
      this.vec = utils.fromSql(vec);
    }
  }

  toArray() {
    return this.vec;
  }

  toPostgres() {
    return this.toString();
  }

  toString() {
    return utils.toSql(this.vec);
  }
}

function vector(vec) {
  return new Vector(vec);
}

module.exports = {vector};
