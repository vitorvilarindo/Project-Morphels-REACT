import { fastify } from 'fastify'
import { dataBasePostgresUsers, dataBasePostgresRevenues } from './database_postgres.js'

const server = fastify()

const database_users = new dataBasePostgresUsers()
const database_revenues = new dataBasePostgresRevenues()

server.post('/users', async (request, reply) => {
  const { name, email, password } = request.body
  await database_users.create_user({ 
    name,
    email,
    password
   })
  reply.status(201).send()
  console.log("Deu bom")
})

server.get('/users', async (request, reply) => {
  const search = request.query.search


  const videos = await database_users.list_user(search)
  return reply.status(200).send(videos)
})

server.put('/users/:id', async (request, reply) => {
  const userID = request.params.id
  const { name, email, password } = request.body

  await database_users.edit_user(userID, { 
    name,
    email,
    password
  })

  return reply.status(204).send()
})

server.delete('/users/:id', async (request, reply) => {
  const userID = request.params.id

  await database_users.delete_user(userID)

  return reply.status(204).send()
})

server.post('/revenues', async (request, reply) => {
  const { member, type, payment, reference_mounth, date, user_id } = request.body
  await database_revenues.create_revenue({
    member,
    type,
    payment,
    reference_mounth,
    date,
    user_id
   })
  reply.status(201).send()
  console.log("Deu bom")
})

server.listen(
  { port: 3000}
)