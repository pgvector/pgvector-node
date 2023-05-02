"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _index = _interopRequireDefault(require("../utils/index.mjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function registerType(client) {
  const result = await client.query('SELECT typname, oid, typarray FROM pg_type WHERE typname = $1', ['vector']);
  if (result.rowCount < 1) {
    throw new Error('vector type not found in the database');
  }
  const oid = result.rows[0].oid;
  client.setTypeParser(oid, 'text', function (value) {
    return _index.default.fromSql(value);
  });
}
function toSql(value) {
  if (!Array.isArray(value)) {
    throw new Error('expected array');
  }
  return _index.default.toSql(value);
}
var _default = {
  registerType,
  toSql
};
exports.default = _default;