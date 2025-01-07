import { getWeekSummary } from '@/app/functions/get-week-summary'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/summary',
    {
      schema: {
        onRequest: [authenticateUserHook],
        tags: ['goals'],
        description: 'Get week summary',
        response: {
          200: z.object({
            summary: z.object({
              completed: z.number(),
              total: z.number(),
              goalsPerDay: z.record(
                z.string(),
                z.array(
                  z.object({
                    id: z.string(),
                    title: z.string(),
                    createdAt: z.string(),
                  })
                )
              ),
            }),
          }),
        },
      },
    },
    async (_, reply) => {
      const { summary } = await getWeekSummary()

      return reply.status(200).send({ summary })
    }
  )
}
