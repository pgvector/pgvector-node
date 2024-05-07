const { PgColumn, PgColumnBuilder } = require('drizzle-orm/pg-core');
const utils = require('../utils');

class PgHalfvecBuilder extends PgColumnBuilder {
  constructor(name, dimensions) {
    super(name);
    this.config.dimensions = dimensions;
  }

  build(table) {
    return new PgHalfvec(table, this.config);
  }
}

class PgHalfvec extends PgColumn {
  constructor(table, config) {
    super(table, config);
    this.dimensions = config.dimensions;
  }

  getSQLType() {
    return utils.halfvecType(this.dimensions);
  }

  mapFromDriverValue(value) {
    return utils.fromSql(value);
  }

  mapToDriverValue(value) {
    return utils.toSql(value);
  }
}

function halfvec(name, config) {
  return new PgHalfvecBuilder(name, config && config.dimensions);
}

module.exports = {halfvec};
