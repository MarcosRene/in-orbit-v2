import { getWeekPendingGoals } from '@/app/functions/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/pending-goals',
    {
      schema: {
        onRequest: [authenticateUserHook],
        tags: ['goals'],
        description: 'Get pending goals',
        response: {
          200: z.object({
            pendingGoals: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                desiredWeeklyFrequency: z.number(),
                completionCount: z.number(),
              })
            ),
          }),
        },
      },
    },
    async (_, reply) => {
      const { pendingGoals } = await getWeekPendingGoals()

      return reply.status(200).send({ pendingGoals })
    }
  )
}
