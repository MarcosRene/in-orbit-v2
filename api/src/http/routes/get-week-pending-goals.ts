import { getWeekPendingGoals } from '@/app/functions/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/pending-goals',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['goals'],
        operationId: 'getWeekPendingGoals',
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
    async (request, reply) => {
      const userId = request.user.sub
      const { pendingGoals } = await getWeekPendingGoals({ userId })

      return reply.status(200).send({ pendingGoals })
    }
  )
}

