import { env } from '@/env'
import { SignJWT } from 'jose'

export async function authenticateUser(userId: string) {
  const secret = new TextEncoder().encode(env.JWT_SECRET)

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret)

  return token
}
