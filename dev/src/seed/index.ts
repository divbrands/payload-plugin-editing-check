import type { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Seeding data...')

  await payload.create({
    collection: 'examples',
    data: {
      someField: 'Seeded title',
    },
  })

  // Add additional seed data here
}
