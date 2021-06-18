# pgvector-node

[pgvector](https://github.com/ankane/pgvector) support for Node.js

Supports [Sequelize](https://github.com/sequelize/sequelize) and [node-postgres](https://github.com/brianc/node-postgres)

[![Build Status](https://github.com/ankane/pgvector-node/workflows/build/badge.svg?branch=master)](https://github.com/ankane/pgvector-node/actions)

## Installation

Run:

```sh
npm install pgvector
```

And follow the instructions for your database library:

- [Sequelize](#sequelize)
- [node-postgres](#node-postgres)

## Sequelize

Register the type

```js
const { Sequelize } = require('sequelize');
const pgvector = require('pgvector/sequelize');

pgvector.registerType(Sequelize);
```

Add a vector field

```js
Item.init({
  factors: {
    type: DataTypes.VECTOR(3)
  }
}, ...);
```

Insert a vector

```js
await Item.create({factors: [1, 2, 3]});
```

Get the nearest neighbors to a vector

```js
const items = await Item.findAll({
  order: [sequelize.literal(`factors <-> '[1, 2, 3]'`)],
  limit: 5
});
```

## node-postgres

Register the type

```js
const pgvector = require('pgvector/pg');

await pgvector.registerType(client);
```

Insert a vector

```js
const factors = [1, 2, 3];
await client.query('INSERT INTO items (factors) VALUES ($1)', [pgvector.toSql(factors)]);
```

Get the nearest neighbors to a vector

```js
const result = await client.query('SELECT * FROM items ORDER BY factors <-> $1 LIMIT 5', [pgvector.toSql(factors)]);
```

## History

View the [changelog](https://github.com/ankane/pgvector-node/blob/master/CHANGELOG.md)

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/ankane/pgvector-node/issues)
- Fix bugs and [submit pull requests](https://github.com/ankane/pgvector-node/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features

To get started with development:

```sh
git clone https://github.com/ankane/pgvector-node.git
cd pgvector-node
npm install
npm test
```
