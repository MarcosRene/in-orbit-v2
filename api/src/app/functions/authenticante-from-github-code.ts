import { db } from '@/db'
import { users } from '@/db/schema'
import {
  getAccessTokenFromCode,
  getUserFromAccessToken,
} from '@/modules/github-oauth'
import { eq } from 'drizzle-orm'

interface AuthenticateFromGithubCodeRequest {
  code: string
}

export async function authenticateFromGithubCode({
  code,
}: AuthenticateFromGithubCodeRequest) {
  const accessToken = await getAccessTokenFromCode(code)
  const githubUser = await getUserFromAccessToken(accessToken)

  const result = await db
    .select()
    .from(users)
    .where(eq(users.externalAccountId, githubUser.id.toString()))

  let userId: string | null

  const userAlreadyExists = result.length > 0

  if (userAlreadyExists) {
    userId = result[0].id
  } else {
    const [insertedUser] = await db
      .insert(users)
      .values({
        name: githubUser.name.toString(),
        email: githubUser.email.toString(),
        avatarUrl: githubUser.avatar_url.toString(),
        externalAccountId: githubUser.id.toString(),
      })
      .returning()

    userId = insertedUser.id
  }
}
