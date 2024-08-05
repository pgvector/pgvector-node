import pg from 'pg';
import pgvector from 'pgvector/pg';
import initRDKitModule from '@rdkit/rdkit';

const RDKit = await initRDKitModule();

function generateFingerprint(molecule) {
  const options = {radius: 3};
  return RDKit.get_mol(molecule).get_morgan_fp(JSON.stringify(options));
}

const client = new pg.Client({database: 'pgvector_example'});
await client.connect();

await client.query('CREATE EXTENSION IF NOT EXISTS vector');
await pgvector.registerTypes(client);

await client.query('DROP TABLE IF EXISTS molecules');
await client.query('CREATE TABLE molecules (id text PRIMARY KEY, fingerprint bit(2048))');

const molecules = ['Cc1ccccc1', 'Cc1ncccc1', 'c1ccccn1'];
for (const molecule of molecules) {
  const fingerprint = generateFingerprint(molecule);
  await client.query('INSERT INTO molecules (id, fingerprint) VALUES ($1, $2)', [molecule, fingerprint]);
}

const queryMolecule = 'c1ccco1';
const queryFingerprint = generateFingerprint(queryMolecule);
const { rows } = await client.query('SELECT id, fingerprint <%> $1 AS distance FROM molecules ORDER BY distance LIMIT 5', [queryFingerprint]);
for (let row of rows) {
  console.log(row);
}

await client.end();
