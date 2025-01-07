import { createGoalCompletion } from '@/app/functions/create-goal-completion'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const createGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['goals'],
        description: 'Complete a goal',
        body: z.object({
          goalId: z.string(),
        }),
        response: {
          200: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { goalId } = request.body

      await createGoalCompletion({
        goalId,
      })

      return reply.status(200).send()
    }
  )
}
