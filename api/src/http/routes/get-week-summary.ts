import { getWeekSummary } from '@/app/functions/get-week-summary'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { authenticateUserHook } from '../hooks/authenticate-user'
import dayjs from 'dayjs'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/summary',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['goals'],
        operationId: 'getWeekSummary',
        description: 'Get week summary',
        querystring: z.object({
          weekStartsAt: z.coerce
            .date()
            .optional()
            .default(dayjs().startOf('week').toDate()),
        }),
        response: {
          200: z.object({
            summary: z.object({
              completed: z.number(),
              total: z.number().nullable(),
              goalsPerDay: z
                .record(
                  z.string(),
                  z.array(
                    z.object({
                      id: z.string(),
                      title: z.string(),
                      completedAt: z.string(),
                    })
                  )
                )
                .nullable(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const userId = request.user.sub
      const { weekStartsAt } = request.query
      const { summary } = await getWeekSummary({
        userId,
        weekStartsAt,
      })

      return { summary }
    }
  )
}

