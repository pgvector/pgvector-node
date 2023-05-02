# pgvector-node

[pgvector](https://github.com/pgvector/pgvector) support for Node.js

Supports [Sequelize](https://github.com/sequelize/sequelize), [node-postgres](https://github.com/brianc/node-postgres), [pg-promise](https://github.com/vitaly-t/pg-promise), and [Prisma](https://github.com/prisma/prisma)

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
- [Prisma](#prisma)

## Sequelize

Register the type

```javascript
import { Sequelize } from 'sequelize';
import pgvector from 'pgvector/sequelize';

pgvector.registerType(Sequelize);
```

Add a vector field

```javascript
Item.init({
  embedding: {
    type: DataTypes.VECTOR(3)
  }
}, ...);
```

Insert a vector

```javascript
await Item.create({embedding: [1, 2, 3]});
```

Get the nearest neighbors to a vector

```javascript
const items = await Item.findAll({
  order: [sequelize.literal(`embedding <-> '[1, 2, 3]'`)],
  limit: 5
});
```

## node-postgres

Register the type

```javascript
import pgvector from 'pgvector/pg';

await pgvector.registerType(client);
```

Insert a vector

```javascript
const embedding = [1, 2, 3];
await client.query('INSERT INTO items (embedding) VALUES ($1)', [pgvector.toSql(embedding)]);
```

Get the nearest neighbors to a vector

```javascript
const result = await client.query('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql(embedding)]);
```

## pg-promise

Register the type

```javascript
const pgvector = require('pgvector/pg');

const initOptions = {
  async connect(e) {
    await pgvector.registerType(e.client);
  }
};
const pgp = require('pg-promise')(initOptions);
```

Insert a vector

```javascript
const embedding = [1, 2, 3];
await db.none('INSERT INTO items (embedding) VALUES ($1)', [pgvector.toSql(embedding)]);
```

Get the nearest neighbors to a vector

```javascript
const result = await db.any('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql(embedding)]);
```

## Prisma

Import the library

```javascript
import pgvector from 'pgvector/utils';
```

Add the extension to the schema

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [vector]
}
```

Add a vector column to the schema

```prisma
model Item {
  id        Int                       @id @default(autoincrement())
  embedding Unsupported("vector(3)")?
}
```

Insert a vector

```javascript
const embedding = pgvector.toSql([1, 1, 1])
await prisma.$executeRaw`INSERT INTO items (embedding) VALUES (${embedding}::vector)`
```

Get the nearest neighbors to a vector

```javascript
const embedding = pgvector.toSql([1, 1, 1])
const items = await prisma.$queryRaw`SELECT id, embedding::text FROM items ORDER BY embedding <-> ${embedding}::vector LIMIT 5`
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
npx prisma migrate dev
npm test
```
