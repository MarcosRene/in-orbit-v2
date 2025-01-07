import { env } from '@/env'

type Id = {
  type: string
  format: string
  examples?: number[]
}

type Email = {
  type: string[]
  format: string
  examples?: string[]
}

type Gravatarid = {
  type: string[]
  examples?: string[]
}

type Avatarurl = {
  type: string
  format: string
  examples?: string[]
}

interface AccessTokenResponse {
  acess_token: string
}

interface GetUserReponse {
  id: Id
  name: Gravatarid
  email: Email
  avatar_url: Avatarurl
}

export async function getAccessTokenFromCode(code: string) {
  const acessTokenURL = new URL('https://github.com/login/oauth/access_token')

  acessTokenURL.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
  acessTokenURL.searchParams.set('client_secret', env.GITHUB_CLIENT_SECRET)
  acessTokenURL.searchParams.set('code', code)

  const response = await fetch(acessTokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  })

  const { acess_token }: AccessTokenResponse = await response.json()

  return acess_token
}

export async function getUserFromAccessToken(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  })

  const data: GetUserReponse = await response.json()

  return data
}
