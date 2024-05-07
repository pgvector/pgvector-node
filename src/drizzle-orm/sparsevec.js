const { PgColumn, PgColumnBuilder } = require('drizzle-orm/pg-core');
const utils = require('../utils');

class PgSparsevecBuilder extends PgColumnBuilder {
  constructor(name, dimensions) {
    super(name);
    this.config.dimensions = dimensions;
  }

  build(table) {
    return new PgSparsevec(table, this.config);
  }
}

class PgSparsevec extends PgColumn {
  constructor(table, config) {
    super(table, config);
    this.dimensions = config.dimensions;
  }

  getSQLType() {
    return utils.sparsevecType(this.dimensions);
  }

  mapFromDriverValue(value) {
    return utils.sparsevecFromSql(value);
  }

  mapToDriverValue(value) {
    return utils.sparsevecToSql(value);
  }
}

function sparsevec(name, config) {
  return new PgSparsevecBuilder(name, config && config.dimensions);
}

module.exports = {sparsevec};
