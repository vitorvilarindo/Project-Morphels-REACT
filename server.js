import { fastify } from 'fastify'
import {  dataBasePostgresUsers, dataBasePostgresRevenues, dataBasePostgresExpenses, dataBasePostgresMembers, dataBasePostgresCompanies } from './database_postgres.js'
import cors from '@fastify/cors'

const server = fastify()
server.register(cors,{
  origin: '*',
  methods: ['GET','PUT','POST','DELETE']
})
const database_users = new dataBasePostgresUsers()
const database_revenues = new dataBasePostgresRevenues()
const database_expenses = new dataBasePostgresExpenses()
const database_members = new dataBasePostgresMembers()
const database_companies = new dataBasePostgresCompanies()

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
  const { member, type, value, payment, date } = request.body
  await database_revenues.create_revenue({
    member,
    type,
    value,
    payment,
    reference_mounth: "NOVEMBER",
    date,
    user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"
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
  const { member, type, value, payment, date} = request.body
  await database_revenues.edit_revenues(revenuesID, {
    member,
    type,
    value,
    payment,
    reference_mounth: "NOVEMBER",
    date,
    user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"

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
  const { title, category, value, payment, date, beneficiary } = request.body
  await database_expenses.create_expense({
    title,
    category,
    value,
    payment,
    reference_mounth: "NOVEMBER",
    date,
    beneficiary,
    user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"
  })
  reply.status(201).send()
  console.log("Deu bom")
})
server.get('/expenses', async (request, reply) => {
  const search = request.query.search
  const expenses = await database_expenses.list_expenses(search)
  return reply.status(200).send(expenses)
})
server.put('/expenses/:id', async (request,reply) => {
  const expenseID = request.params.id
  const {title, category, value, payment, date, beneficiary} = request.body
  await database_expenses.edit_expenses(expenseID, {
    title,
    category,
    value,
    payment,
    reference_mounth: "NOVEMBER",
    date,
    beneficiary,
    user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"
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
  const { name, cellphone, date_birth, pixkey, pixtype } = request.body
  await database_members.create_members({
    name,
    cellphone,
    date_birth,
    pixkey,
    pixtype,
    user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"
  })
  reply.status(201).send()
  console.log("Deu bom")
})

server.get('/members', async (request, reply) => {
  const search = request.query.search
  const members = await database_members.list_members(search)
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

// COMPANIES

server.post('/companies', async (request, reply) => {
  const { CNPJ, company_name, fantasy_name, estate_registration, municipal_registration, open_date, situation, cep, street, number, complement, neighborhood, city, UF, cellphone, email, CNAE, activity_description, pixkey, pixtype } = request.body
  console.log(request.body)
  await database_companies.create_company({
    CNPJ,
    company_name,
    fantasy_name,
    estate_registration,
    municipal_registration,
    open_date,
    situation,
    cep,
    street,
    number,
    complement,
    neighborhood,
    city,
    UF,
    cellphone,
    email,
    CNAE,
    activity_description,
    pixkey,
    pixtype,
    user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"
  })
  reply.status(201).send()
  console.log("Deu bom")
})
server.get('/companies', async (request, reply) => {
  const search = request.query.search
  const companies = await database_companies.list_companies(search)
  return reply.status(200).send(companies)
})
server.put('/companies/:id', async (request, reply) => {
  const companyID = request.params.id
  const { CNPJ, company_name, fantasy_name, estate_registration, municipal_registration, open_date, situation, cep, street, number, complement, neighborhood, city, UF, cellphone, email, CNAE, activity_description, pixkey, pixtype, user_id } = request.body
  await database_companies.edit_companies(companyID, {
    CNPJ,
    company_name,
    fantasy_name,
    estate_registration,
    municipal_registration,
    open_date,
    situation,
    cep,
    street,
    number,
    complement,
    neighborhood,
    city,
    UF,
    cellphone,
    email,
    CNAE,
    activity_description,
    pixkey,
    pixtype,
    user_id
  })
  return reply.status(204).send()
})
server.delete('/companies/:id', async (request, reply) => {
  const companyID = request.params.id
  await database_companies.delete_companies(companyID)
  return reply.status(204).send()
})