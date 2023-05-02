function fromSql(value) {
  return value.substring(1, value.length - 1).split(',').map((v) => parseFloat(v));
}

function toSql(value) {
  return JSON.stringify(value);
}

export default {fromSql, toSql};
