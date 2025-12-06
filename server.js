import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import usersRoutes from "./routes/usersRoutes.js";
import revenuesRoutes from "./routes/revenuesRoutes.js";
import expensesRoutes from "./routes/expensesRoutes.js";
import membersRoutes from "./routes/membersRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";

const server = Fastify({ logger: true })

// CORS primeiro
server.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
})

// JWT e cookies
server.register(jwt, { secret: process.env.JWT_SECRET_KEY })
server.register(cookie)

// Rotas
server.register(usersRoutes)
server.register(revenuesRoutes)
server.register(expensesRoutes)
server.register(membersRoutes)
server.register(companiesRoutes)

// Start
const start = async () => {
    try {
        await server.listen({ port: 3000 })
        console.log('🚀 Servidor rodando em http://localhost:3000')
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
start()
