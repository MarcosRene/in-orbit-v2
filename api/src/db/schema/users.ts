import { createId } from '@paralleldrive/cuid2'
import { pgTable, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email'),
  avatarUrl: text('avatar_url').notNull(),
  externalAccountId: text('external_account_id').notNull().unique(),
})
