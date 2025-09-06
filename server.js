import { fastify } from 'fastify'
import { dataBasePostgresUsers } from './database_postgres.js'

const server = fastify()

const database = new dataBasePostgresUsers()

server.post('/users', async (request, reply) => {
  const { name, email, password } = request.body
  await database.create_user({ 
    name,
    email,
    password
   })
  reply.status(201).send()
  console.log("Deu bom")
})

server.get('/users', async (request, reply) => {
  const search = request.query.search


  const videos = await database.list_user(search)
  return reply.status(200).send(videos)
})

server.put('/users/:id', async (request, reply) => {
  const userID = request.params.id
  const { name, email, password } = request.body

  await database.edit_user(userID, { 
    name,
    email,
    password
  })

  return reply.status(204).send()
})

server.delete('/users/:id', async (request, reply) => {
  const userID = request.params.id

  await database.delete_user(userID)

  return reply.status(204).send()
})

server.listen(
  { port: 3000}
)