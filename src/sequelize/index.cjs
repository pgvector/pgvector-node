"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = _interopRequireDefault(require("util"));
var _index = _interopRequireDefault(require("../utils/index.mjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function registerType(Sequelize) {
  const DataTypes = Sequelize.DataTypes;
  const PgTypes = DataTypes.postgres;
  const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;
  class VECTOR extends ABSTRACT {
    constructor(dimensions) {
      super();
      this._dimensions = dimensions;
    }
    toSql() {
      if (this._dimensions === undefined) {
        return 'VECTOR';
      }
      if (!Number.isInteger(this._dimensions)) {
        throw new Error('expected integer');
      }
      return _util.default.format('VECTOR(%d)', this._dimensions);
    }
    _stringify(value) {
      return _index.default.toSql(value);
    }
    static parse(value) {
      return _index.default.fromSql(value);
    }
  }
  VECTOR.prototype.key = VECTOR.key = 'vector';
  DataTypes.VECTOR = Sequelize.Utils.classToInvokable(VECTOR);
  DataTypes.VECTOR.types.postgres = ['vector'];
  PgTypes.VECTOR = function VECTOR() {
    if (!(this instanceof PgTypes.VECTOR)) {
      return new PgTypes.VECTOR();
    }
    DataTypes.VECTOR.apply(this, arguments);
  };
  _util.default.inherits(PgTypes.VECTOR, DataTypes.VECTOR);
  PgTypes.VECTOR.parse = DataTypes.VECTOR.parse;
  PgTypes.VECTOR.types = {
    postgres: ['vector']
  };
  DataTypes.postgres.VECTOR.key = 'vector';
}
var _default = {
  registerType
};
exports.default = _default;