import { Recommender, loadMovieLens } from 'disco-rec';
import pg from 'pg';
import pgvector from 'pgvector/pg';

const client = new pg.Client({database: 'pgvector_example'});
await client.connect();

await client.query('CREATE EXTENSION IF NOT EXISTS vector');
await pgvector.registerTypes(client);

await client.query('DROP TABLE IF EXISTS users');
await client.query('DROP TABLE IF EXISTS movies');
await client.query('CREATE TABLE users (id integer PRIMARY KEY, factors vector(20))');
await client.query('CREATE TABLE movies (name text PRIMARY KEY, factors vector(20))');

const data = await loadMovieLens();
const recommender = new Recommender({factors: 20});
recommender.fit(data);

for (let userId of recommender.userIds()) {
  const factors = Array.from(recommender.userFactors(userId));
  await client.query('INSERT INTO users (id, factors) VALUES ($1, $2)', [userId, pgvector.toSql(factors)]);
}

for (let itemId of recommender.itemIds()) {
  const factors = Array.from(recommender.itemFactors(itemId));
  await client.query('INSERT INTO movies (name, factors) VALUES ($1, $2)', [itemId, pgvector.toSql(factors)]);
}

const movie = 'Star Wars (1977)';
console.log(`Item-based recommendations for ${movie}`);
let result = await client.query('SELECT name FROM movies WHERE name != $1 ORDER BY factors <=> (SELECT factors FROM movies WHERE name = $1) LIMIT 5', [movie]);
for (let row of result.rows) {
  console.log(`- ${row.name}`);
}

const userId = 123;
console.log(`\nUser-based recommendations for user ${userId}`);
result = await client.query('SELECT name FROM movies ORDER BY factors <#> (SELECT factors FROM users WHERE id = $1) LIMIT 5', [userId]);
for (let row of result.rows) {
  console.log(`- ${row.name}`);
}

await client.end();
