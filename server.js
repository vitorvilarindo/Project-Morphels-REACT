import { fastify } from 'fastify'
import {  dataBasePostgresUsers, dataBasePostgresRevenues, dataBasePostgresExpenses, dataBasePostgresMembers } from './database_postgres.js'

const server = fastify()

const database_users = new dataBasePostgresUsers()
const database_revenues = new dataBasePostgresRevenues()
const database_expenses = new dataBasePostgresExpenses()
const database_members = new dataBasePostgresMembers()

//USERS
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

//REVENUES
server.post('/revenues', async (request, reply) => {
  const { member, type, payment, reference_mounth, date, user_id } = request.body
  await database_revenues.create_revenue({
    member,
    type,
    payment,
    reference_mounth,
    date: new Date(date),
    user_id
   })
  reply.status(201).send()
  console.log("Deu bom")
})
server.get('/revenues', async (request, reply) => {
  const search = request.query.search
  const revenues = await database_revenues.list_revenues(search)
  return reply.status(200).send(revenues)
})

server.put('/revenues/:id', async (request, reply) => {
  const revenuesID = request.params.id
  const { member, type, payment, reference_mounth, date, user_id} = request.body
  await database_revenues.edit_revenues(revenuesID, {
    member,
    type,
    payment,
    reference_mounth,
    date,
    user_id

  })
  return reply.status(204).send()
})
server.delete('/revenues/:id', async (request, reply) => {
  const revenuesID = request.params.id
  await database_revenues.delete_revenues(revenuesID)
  return reply.status(204).send()
})

//EXPENSES
server.post('/expenses', async (request, reply) => {
  const { title, category, payment, reference_mounth, date, beneficiary, user_id } = request.body
  await database_expenses.create_expense({
    title,
    category,
    payment,
    reference_mounth,
    date: new Date(date),
    beneficiary,
    user_id
  })
  reply.status(201).send()
  console.log("Deu bom")
})
server.get('/expenses', async (request, reply) => {
  const search = request.query.search
  if (search) {
    const expenses = await database_expenses.list_expenses(search)
  } else {
    const expenses = await database_expenses.list_expenses()
  }
  return reply.status(200).send(expenses)
})
server.put('/expenses/:id',async (request,reply) => {
  const expenseID = request.params.id
  const {title, category, payment, reference_mounth, date, beneficiary, user_id} = request.body
await database_expenses.edit_expenses(expenseID, {
  title,
  category,
  payment,
  reference_mounth,
  date,
  beneficiary,
  user_id
})
return reply.status(204).send()
})
server.delete('/expenses/:id', async (request, reply) => {
  const expenseID = request.params.id
  await database_expenses.delete_expenses(expenseID )
  return reply.status(204).send()
})

//MEMBERS
server.post('/members', async (request, reply) => {
  const { name, user_id } = request.body
  await database_members.create_member({
    name,
    user_id
  })
  reply.status(201).send()
  console.log("Deu bom")
})
server.get('/members', async (request, reply) => {
  const search = request.query.search
  if (search) {
    const members = await database_members.list_members(search)
  } else {
    const members = await database_members.list_members()
  }
  return reply.status(200).send(members)
})
server.put('/members/:id', async (request, reply) => {
  const memberID = request.params.id
  const { name, user_id } = request.body
  await database_members.edit_members(memberID, {
    name,
    user_id
  })
  return reply.status(204).send()
})
server.delete('/members/:id', async (request, reply) => {
  const memberID = request.params.id
  await database_members.delete_members(memberID)
  return reply.status(204).send()
})
server.listen(
  { port: 3000}
)