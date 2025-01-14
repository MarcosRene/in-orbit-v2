import { db } from '@/db'
import { users } from '@/db/schema'

import { faker } from '@faker-js/faker'
import { InferSelectModel } from 'drizzle-orm'

export async function makeUser(
  overrides: Partial<InferSelectModel<typeof users>> = {}
) {
  const [row] = await db
    .insert(users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      externalAccountId: faker.number.int({ min: 1, max: 1_000_000 }),
      ...overrides,
    })
    .returning()

  return row
}

