const { vector } = require('../knex');
const { raw } = require('objection');

function l2Distance(column, value) {
  return raw('?? <-> ?', [column, vector(value)]);
}

function maxInnerProduct(column, value) {
  return raw('?? <#> ?', [column, vector(value)]);
}

function cosineDistance(column, value) {
  return raw('?? <=> ?', [column, vector(value)]);
}

module.exports = {vector, l2Distance, maxInnerProduct, cosineDistance};
