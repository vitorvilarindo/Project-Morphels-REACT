import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import usersRoutes from "./src/routes/usersRoutes.js";
import revenuesRoutes from "./src/routes/revenuesRoutes.js";
import expensesRoutes from "./src/routes/expensesRoutes.js";
import membersRoutes from "./src/routes/membersRoutes.js";
import companiesRoutes from "./src/routes/companiesRoutes.js";
import rolesRoutes from "./src/routes/rolesRoutes.js";
import sectorsRoutes from "./src/routes/sectorsRoutes.js";
import churchesRoutes from "./src/routes/branchesRoutes.js";
import repostsRotes from "./src/routes/repostsRoutes.js";
import cardsRoutes from "./src/routes/cardsRoutes.js";
import containerPlugin from "./src/Services/containerPlugin.js";
import {sql} from "./db.js";

const server = Fastify({ logger: true })

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
await server.register(containerPlugin)

// Rotas
server.register(usersRoutes)
server.register(revenuesRoutes)
server.register(expensesRoutes)
server.register(membersRoutes)
server.register(companiesRoutes)
server.register(rolesRoutes)
server.register(sectorsRoutes)
server.register(churchesRoutes)
server.register(repostsRotes)
server.register(cardsRoutes)

//Middlewares
server.addHook('preHandler', async (request, reply) => {
    const publicRoutes = ['/users/login'];
    if (publicRoutes.includes(request.url)) {
        return
    }

    try {
        const decoded = await request.jwtVerify()
        request.userID = decoded.sub
    } catch (err) {
        return reply.status(401).send({ error: 'Invalid or expired token.' })
    }
})
server.decorate('checkPermissions', function (action) {
    return async (request, reply) => {
        try {
            console.log("Bom dia")

            const userID = request.userID;

            const rawPath = request.routerPath || request.url.split('?')[0];

            const pageName = rawPath.split('/')[1];

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
                SELECT access_scope as scope
                FROM permissions p
                JOIN users u ON p.role_id = u.designation
                JOIN pages pg ON pg.id = p.page_id
                WHERE u.id = ${userID}
                AND pg.name = ${pageName}
            `

            request.access_scope = access_scope[0].scope

            if (permission.length === 0 || !permission[0].has_permission) {
                return reply.status(403).send({
                    message: "You do not have permission to execute this action."
                });
            }

        } catch (e) {
            console.error("ERRO NO SQL OU MIDDLEWARE:", e);

            return reply.status(500).send({
                message: 'Internal Server Error' + e
            });
        }
    }
})

// Start
const start = async () => {
    try {
        await server.listen({ port: process.env.PORT })
        console.log('🚀 Servidor rodando em http://localhost:3000')
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
start().then()
