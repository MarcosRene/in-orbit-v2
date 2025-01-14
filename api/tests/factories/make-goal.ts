import { db } from '@/db'
import { goals } from '@/db/schema'

import { faker } from '@faker-js/faker'
import { InferSelectModel } from 'drizzle-orm'

export async function makeGoal(
  overrides: Partial<InferSelectModel<typeof goals>> &
    Pick<InferSelectModel<typeof goals>, 'userId'>
) {
  const [row] = await db
    .insert(goals)
    .values({
      title: faker.lorem.word(),
      desiredWeeklyFrequency: faker.number.int({ min: 1, max: 7 }),
      ...overrides,
    })
    .returning()

  return row
}

