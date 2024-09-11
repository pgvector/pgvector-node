import { PGVectorStore, OpenAIEmbedding, TextNode } from 'llamaindex'
import pg from 'pg'
import pgvector from 'pgvector/pg'

const client = new pg.Client({ database: 'pgvector_example' })
await client.connect()

await client.query('CREATE EXTENSION IF NOT EXISTS vector')
await pgvector.registerTypes(client)

const embedding = new OpenAIEmbedding()

const input = [
  new TextNode({
    text: 'The dog is barking'
  }),
  new TextNode({
    text: 'The cat is purring'
  }),
  new TextNode({
    text: 'The bear is growling'
  })
]

const output = await embedding(input)

const vectorStore = new PGVectorStore(client)

await vectorStore.add(output)

const { nodes } = await vectorStore.query({
  queryEmbedding: await embedding.getTextEmbedding('cat')
})

console.log('search result for cat:', nodes[0].text)

await client.end()
