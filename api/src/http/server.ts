import fastify from 'fastify'
import { fastifyCors } from '@fastify/cors'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoalRoute } from './routes/create-goal'
import { createGoalCompletionRoute } from './routes/create-goal-completion'
import { getWeekSummaryRoute } from './routes/get-week-summary'
import { getWeekPendingGoalsRoute } from './routes/get-week-pending-goals'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { authenticateFromGithub } from './routes/authenticante-from-github'
import { fastifyJwt } from '@fastify/jwt'
import { env } from '@/env'
import { getProfile } from './routes/get-profile'
import { getUserExperienceAndLevelRoute } from './routes/get-user-experience-and-level'
import path from 'node:path'
import { writeFile } from 'node:fs/promises'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, { origin: '*' })

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'in.orbit',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(authenticateFromGithub)
app.register(createGoalRoute)
app.register(createGoalCompletionRoute)
app.register(getWeekSummaryRoute)
app.register(getWeekPendingGoalsRoute)
app.register(getProfile)
app.register(getUserExperienceAndLevelRoute)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})

if (env.NODE_ENV === 'development') {
  const specFile = path.resolve(__dirname, '../../swagger.json')

  app.ready().then(() => {
    const spec = JSON.stringify(app.swagger(), null, 2)

    writeFile(specFile, spec).then(() => {
      console.log(`Swagger spec written to ${specFile}`)
    })
  })
}

