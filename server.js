import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import usersRoutes from "./routes/usersRoutes.js";
import revenuesRoutes from "./routes/revenuesRoutes.js";
import expensesRoutes from "./routes/expensesRoutes.js";
import membersRoutes from "./routes/membersRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";
import permissionsRoutes from "./routes/permissionsRoutes.js";
import rolesRoutes from "./routes/rolesRoutes.js";
import sectorsRoutes from "./routes/sectorsRoutes.js";
import {getPermissionsRolesByID} from "./controllers/createAccessPemissionsRoles.js";
import accessPermissionsRolesRoutes from "./routes/createAccessPermissionsRolesRoutes.js";

const server = Fastify({ logger: true })

// CORS primeiro
server.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
})

// JWT e cookies
server.register(jwt, { secret: process.env.JWT_SECRET_KEY, cookie: {
        cookieName: 'token',
        signed: false
    } },

)
server.register(cookie)

server.addHook('preHandler', async (request, reply) => {
    // Ignora rota de login
    const publicRoutes = ['/users/login'];
    if (publicRoutes.includes(request.url)) {
        return
    }

    try {
        const decoded = await request.jwtVerify()
        request.userID = decoded.sub
        request.permisions = await getPermissionsRolesByID(decoded.sub)
        console.log(request.permisions)
    } catch (err) {
        return reply.status(401).send({ error: 'Token inválido ou expirado' })
    }
})


// Rotas
server.register(usersRoutes)
server.register(revenuesRoutes)
server.register(expensesRoutes)
server.register(membersRoutes)
server.register(companiesRoutes)
server.register(permissionsRoutes)
server.register(rolesRoutes)
server.register(sectorsRoutes)
server.register(accessPermissionsRolesRoutes)

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
