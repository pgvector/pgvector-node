# pgvector-node

[pgvector](https://github.com/pgvector/pgvector) support for Node.js

Supports [Sequelize](https://github.com/sequelize/sequelize), [node-postgres](https://github.com/brianc/node-postgres), and [pg-promise](https://github.com/vitaly-t/pg-promise)

[![Build Status](https://github.com/pgvector/pgvector-node/workflows/build/badge.svg?branch=master)](https://github.com/pgvector/pgvector-node/actions)

## Installation

Run:

```sh
npm install pgvector
```

And follow the instructions for your database library:

- [Sequelize](#sequelize)
- [node-postgres](#node-postgres)
- [pg-promise](#pg-promise)

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
  embedding: {
    type: DataTypes.VECTOR(3)
  }
}, ...);
```

Insert a vector

```js
await Item.create({embedding: [1, 2, 3]});
```

Get the nearest neighbors to a vector

```js
const items = await Item.findAll({
  order: [sequelize.literal(`embedding <-> '[1, 2, 3]'`)],
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
const embedding = [1, 2, 3];
await client.query('INSERT INTO items (embedding) VALUES ($1)', [pgvector.toSql(embedding)]);
```

Get the nearest neighbors to a vector

```js
const result = await client.query('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql(embedding)]);
```

## pg-promise

Register the type

```js
const pgvector = require('pgvector/pg');

const initOptions = {
  async connect(e) {
    await pgvector.registerType(e.client);
  }
};
const pgp = require('pg-promise')(initOptions);
```

Insert a vector

```js
const embedding = [1, 2, 3];
await db.none('INSERT INTO items (embedding) VALUES ($1)', [pgvector.toSql(embedding)]);
```

Get the nearest neighbors to a vector

```js
const result = await db.any('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql(embedding)]);
```

## History

View the [changelog](https://github.com/pgvector/pgvector-node/blob/master/CHANGELOG.md)

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/pgvector/pgvector-node/issues)
- Fix bugs and [submit pull requests](https://github.com/pgvector/pgvector-node/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features

To get started with development:

```sh
git clone https://github.com/pgvector/pgvector-node.git
cd pgvector-node
npm install
createdb pgvector_node_test
npm test
```
