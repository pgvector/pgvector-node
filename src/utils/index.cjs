"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function fromSql(value) {
  return value.substring(1, value.length - 1).split(',').map(v => parseFloat(v));
}
function toSql(value) {
  return JSON.stringify(value);
}
var _default = {
  fromSql,
  toSql
};
exports.default = _default;