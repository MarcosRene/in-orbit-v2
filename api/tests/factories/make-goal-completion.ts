import { db } from '@/db'
import { goalCompletions } from '@/db/schema'

import { InferSelectModel } from 'drizzle-orm'

export async function makeGoalCompletion(
  overrides: Partial<InferSelectModel<typeof goalCompletions>> &
    Pick<InferSelectModel<typeof goalCompletions>, 'goalId'>
) {
  const [row] = await db.insert(goalCompletions).values(overrides).returning()

  return row
}

