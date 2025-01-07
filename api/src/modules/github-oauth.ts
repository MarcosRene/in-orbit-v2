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
  access_token: string
}

interface GetUserReponse {
  id: number
  name: string | null
  email: string | null
  avatar_url: string | null
}

export async function getAccessTokenFromCode(code: string) {
  const acessTokenURL = new URL('https://github.com/login/oauth/access_token')

  acessTokenURL.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
  acessTokenURL.searchParams.set('client_secret', env.GITHUB_CLIENT_SECRET)
  acessTokenURL.searchParams.set('code', code)

  const response = await fetch(acessTokenURL, {
    headers: {
      Accept: 'application/json',
    },
  })

  const { access_token }: AccessTokenResponse = await response.json()

  return access_token
}

export async function getUserFromAccessToken(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/json',
      Authorization: `token ${accessToken}`,
    },
  })

  const data: GetUserReponse = await response.json()

  return data
}
