const { PgColumn, PgColumnBuilder } = require('drizzle-orm/pg-core');
const utils = require('../utils');

class PgVectorBuilder extends PgColumnBuilder {
  constructor(name, dimensions) {
    super(name);
    this.config.dimensions = dimensions;
  }

  build(table) {
    return new PgVector(table, this.config);
  }
}

class PgVector extends PgColumn {
  constructor(table, config) {
    super(table, config);
    this.dimensions = config.dimensions;
  }

  getSQLType() {
    return utils.vectorType(this.dimensions);
  }

  mapFromDriverValue(value) {
    return utils.fromSql(value);
  }

  mapToDriverValue(value) {
    return utils.toSql(value);
  }
}

function vector(name, config) {
  return new PgVectorBuilder(name, config && config.dimensions);
}

module.exports = {vector};
