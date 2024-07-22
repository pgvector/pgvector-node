import pg from 'pg';
import pgvector from 'pgvector/pg';
import { from as copyFrom } from 'pg-copy-streams';
import { stdout } from 'process';

// generate random data
const rows = 100000;
const dimensions = 128;
const embeddings = Array.from({length: rows}, () => Array.from({length: dimensions}, () => Math.random()));
const categories = Array.from({length: rows}, () => Math.floor(Math.random() * 100));
const queries = Array.from({length: 10}, () => Array.from({length: dimensions}, () => Math.random()));

// enable extensions
let client = new pg.Client({database: 'pgvector_citus'});
await client.connect();
await client.query('CREATE EXTENSION IF NOT EXISTS citus');
await client.query('CREATE EXTENSION IF NOT EXISTS vector');

// GUC variables set on the session do not propagate to Citus workers
// https://github.com/citusdata/citus/issues/462
// you can either:
// 1. set them on the system, user, or database and reconnect
// 2. set them for a transaction with SET LOCAL
await client.query("ALTER DATABASE pgvector_citus SET maintenance_work_mem = '512MB'");
await client.query('ALTER DATABASE pgvector_citus SET hnsw.ef_search = 20');
await client.end();

// reconnect for updated GUC variables to take effect
client = new pg.Client({database: 'pgvector_citus'});
await client.connect();
await pgvector.registerTypes(client);

console.log('Creating distributed table');
await client.query('DROP TABLE IF EXISTS items');
await client.query(`CREATE TABLE items (id bigserial, embedding vector(${dimensions}), category_id bigint, PRIMARY KEY (id, category_id))`);
await client.query('SET citus.shard_count = 4');
await client.query("SELECT create_distributed_table('items', 'category_id')");

console.log('Loading data in parallel');
const stream = client.query(copyFrom('COPY items (embedding, category_id) FROM STDIN'));
for (const [i, embedding] of embeddings.entries()) {
  const line = `${pgvector.toSql(embedding)}\t${categories[i]}\n`;
  stream.flushChunk(line);
}

stream.on('finish', async function () {
  console.log('Creating index in parallel');
  await client.query('CREATE INDEX ON items USING hnsw (embedding vector_l2_ops)');

  console.log('Running distributed queries');
  for (const query of queries) {
    const { rows } = await client.query('SELECT id FROM items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql(query)]);
    console.log(rows.map((r) => r.id));
  }

  client.end();
});
stream.end();
