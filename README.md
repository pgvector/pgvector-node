# pgvector-node

[pgvector](https://github.com/pgvector/pgvector) support for Node.js (and TypeScript)

Supports [node-postgres](https://github.com/brianc/node-postgres), [Sequelize](https://github.com/sequelize/sequelize), [pg-promise](https://github.com/vitaly-t/pg-promise), [Prisma](https://github.com/prisma/prisma), [Postgres.js](https://github.com/porsager/postgres), [Knex.js](https://github.com/knex/knex), and [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)

[![Build Status](https://github.com/pgvector/pgvector-node/workflows/build/badge.svg?branch=master)](https://github.com/pgvector/pgvector-node/actions)

## Installation

Run:

```sh
npm install pgvector
```

And follow the instructions for your database library:

- [node-postgres](#node-postgres)
- [Sequelize](#sequelize)
- [pg-promise](#pg-promise)
- [Prisma](#prisma)
- [Postgres.js](#postgresjs)
- [Knex.js](#knexjs)
- [Drizzle ORM](#drizzle-orm) (experimental)

Or check out some examples:

- [Embeddings](examples/openai/example.js) with OpenAI
- [Sentence embeddings](examples/transformers/example.js) with Transformers.js
- [Recommendations](examples/disco/example.js) with Disco

## node-postgres

Enable the extension

```javascript
await client.query('CREATE EXTENSION IF NOT EXISTS vector');
```

Register the type for a client

```javascript
import pgvector from 'pgvector/pg';

await pgvector.registerType(client);
```

or a pool

```javascript
pool.on('connect', async function (client) {
  await pgvector.registerType(client);
});
```

Create a table

```javascript
await client.query('CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3))');
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

## Sequelize

Enable the extension

```javascript
await sequelize.query('CREATE EXTENSION IF NOT EXISTS vector');
```

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

## pg-promise

Enable the extension

```javascript
await db.none('CREATE EXTENSION IF NOT EXISTS vector');
```

Register the type

```javascript
import pgpromise from 'pg-promise';
import pgvector from 'pgvector/pg';

const initOptions = {
  async connect(e) {
    await pgvector.registerType(e.client);
  }
};
const pgp = pgpromise(initOptions);
```

Create a table

```javascript
await db.none('CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3))');
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

## Postgres.js

Import the library

```javascript
import pgvector from 'pgvector/utils';
```

Enable the extension

```javascript
await sql`CREATE EXTENSION IF NOT EXISTS vector`;
```

Create a table

```javascript
await sql`CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3))`;
```

Insert vectors

```javascript
const items = [
  {embedding: pgvector.toSql([1, 2, 3])},
  {embedding: pgvector.toSql([4, 5, 6])}
];
await sql`INSERT INTO items ${ sql(items, 'embedding') }`;
```

Get the nearest neighbors to a vector

```javascript
const embedding = pgvector.toSql([1, 2, 3]);
const items = await sql`SELECT * FROM items ORDER BY embedding <-> ${ embedding } LIMIT 5`;
```

## Knex.js

Import the library

```javascript
import pgvector from 'pgvector/utils';
```

Enable the extension

```javascript
await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS vector');
```

Create a table

```javascript
await knex.schema.createTable('items', (table) => {
  table.increments('id');
  table.specificType('embedding', 'vector(3)');
});
```

Insert vectors

```javascript
const newItems = [
  {embedding: pgvector.toSql([1, 2, 3])},
  {embedding: pgvector.toSql([4, 5, 6])}
];
await knex('items').insert(newItems);
```

Get the nearest neighbors to a vector

```javascript
const items = await knex('items')
  .orderByRaw('embedding <-> ?', pgvector.toSql([1, 2, 3]))
  .limit(5);
```

## Drizzle ORM

Note: This is currently experimental and does not work with Drizzle Kit

Enable the extension

```javascript
await client`CREATE EXTENSION IF NOT EXISTS vector`;
```

Add a vector field

```javascript
import { vector } from 'pgvector/drizzle-orm';

const items = pgTable('items', {
  id: serial('id').primaryKey(),
  embedding: vector('embedding', {dimensions: 3})
});
```

Insert vectors

```javascript
const newItems = [
  {embedding: [1, 2, 3]},
  {embedding: [4, 5, 6]}
];
await db.insert(items).values(newItems);
```

Get the nearest neighbors to a vector

```javascript
import { l2Distance } from 'pgvector/drizzle-orm';

const embedding = [1, 2, 3];
const allItems = await db.select().from(items).orderBy(l2Distance(items.embedding, embedding)).limit(5);
```

Also supports `maxInnerProduct` and `cosineDistance`

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
