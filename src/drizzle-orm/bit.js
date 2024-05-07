const { PgColumn, PgColumnBuilder } = require('drizzle-orm/pg-core');
const utils = require('../utils');

class PgBitBuilder extends PgColumnBuilder {
  constructor(name, length) {
    super(name);
    this.config.length = length;
  }

  build(table) {
    return new PgBit(table, this.config);
  }
}

class PgBit extends PgColumn {
  constructor(table, config) {
    super(table, config);
    this.length = config.length;
  }

  getSQLType() {
    return utils.bitType(this.length);
  }
}

function bit(name, config) {
  return new PgBitBuilder(name, config && config.length);
}

module.exports = {bit};
