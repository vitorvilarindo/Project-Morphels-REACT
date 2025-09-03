import { fastify } from 'fastify'
import { dataBasePostgres } from './database_postgres.js'

const server = fastify()

const database = new dataBasePostgres()

server.post('/videos', async (request, reply) => {
  const { title, descripition, duration } = request.body
  await database.create({ 
    title,
    descripition,
    duration
   })
  reply.status(201).send()
  console.log("Deu bom")
})

server.get('/videos', async (request, reply) => {
  const search = request.query.search


  const videos = await database.list(search)
  return reply.status(200).send(videos)
})

server.put('/videos/:id', async (request, reply) => {
  const videoID = request.params.id
  const { title, descripition, duration } = request.body

  await database.edit(videoID, { 
    title,
    descripition,
    duration
  })

  return reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => {
  const videoID = request.params.id

  await database.delete(videoID)

  return reply.status(204).send()
})

server.listen(
  { port: 3000}
)