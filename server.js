import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import usersRoutes from "./routes/usersRoutes.js";
import revenuesRoutes from "./routes/revenuesRoutes.js";
import expensesRoutes from "./routes/expensesRoutes.js";
import membersRoutes from "./routes/membersRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";
import rolesRoutes from "./routes/rolesRoutes.js";
import sectorsRoutes from "./routes/sectorsRoutes.js";
import churchesRoutes from "./routes/churchsRoutes.js";
import generalRoutes from "./routes/generalRoutes.js";
import repostsRotes from "./routes/repostsRoutes.js";
import cardsRoutes from "./routes/cardsRoutes.js";
import pagesRoutes from "./routes/pagesRoutes.js";
import {sql} from "./db.js";

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
    const publicRoutes = ['/users/login'];
    if (publicRoutes.includes(request.url)) {
        return
    }

    try {
        const decoded = await request.jwtVerify()
        request.userID = decoded.sub
    } catch (err) {
        return reply.status(401).send({ error: 'Token inválido ou expirado' })
    }
})
server.decorate('checkPermissions', function (action) {
    return async (request, reply) => {
        try {
            const userID = request.userID;

            // Proteção: se routerPath falhar, usamos a URL limpa
            const rawPath = request.routerPath || request.url.split('?')[0];
            console.log(rawPath)
            const pageName = rawPath.split('/')[1];
            console.log(pageName)

            // LOG DE DEBUG - Verifique seu terminal após o erro 500
            console.log(`DEBUG: User: ${userID}, Page: ${pageName}, Action: ${action}`);

            const permission = await sql`
                SELECT ${action} as has_permission
                FROM permissions p
                JOIN users u ON p.role_id = u.designation
                JOIN pages pg ON pg.id = p.page_id
                WHERE u.id = ${userID}
                  AND pg.name = ${pageName}
                LIMIT 1
            `;
            const access_scope = await sql`
                SELECT access_scope as has_permission
                FROM permissions p 
                JOIN users u ON p.role_id = u.designation
                JOIN pages pg ON pg.id = p.page_id
                WHERE u.id = ${userID}
                AND pg.name = ${pageName}
            `

            request.access_scope = access_scope[0]

            if (permission.length === 0 || !permission[0].has_permission) {
                return reply.status(403).send({
                    message: "You do not have permission to execute this action."
                });
            }

        } catch (e) {
            // ESSA LINHA É A MAIS IMPORTANTE AGORA:
            console.error("ERRO NO SQL OU MIDDLEWARE:", e);

            return reply.status(500).send({
                message: 'Internal Server Error',
                debug: e.message // Remova o 'debug' após consertar
            });
        }
    }
})



// Rotas
server.register(usersRoutes)
server.register(revenuesRoutes)
server.register(expensesRoutes)
server.register(membersRoutes)
server.register(companiesRoutes)
server.register(rolesRoutes)
server.register(sectorsRoutes)
server.register(churchesRoutes)
server.register(generalRoutes)
server.register(repostsRotes)
server.register(cardsRoutes)
server.register(pagesRoutes)

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
start().then()
