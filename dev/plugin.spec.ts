import type { Server } from 'http'
import mongoose from 'mongoose'
import payload from 'payload'
import { start } from './src/server'
import { ExamplesCollectionTypes } from '../src/types'

describe('Plugin tests', () => {
  let server: Server
  let examplesCollection: ExamplesCollectionTypes[]

  beforeAll(async () => {
    server = await start({ local: true })
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    server.close()
  })

  // Add tests to ensure that the plugin works as expected
  it('adds editing check field accordingly', async () => {
    const examplesCollectionQuery = await payload.find({
      collection: 'examples',
      sort: 'createdAt',
    })

    examplesCollection = examplesCollectionQuery.docs

    expect(examplesCollectionQuery.totalDocs).toEqual(1)
  })
})
