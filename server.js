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
import accessPermissionsRolesRoutes from "./routes/createAccessPermissionsRolesRoutes.js";
import {getPermissionByName} from "./controllers/permissionsController.js";
import churchesRoutes from "./routes/churchsRoutes.js";
import {getPermissionsRolesByID} from "./controllers/createAccessPemissionsRoles.js";
import generalRoutes from "./routes/generalRoutes.js";

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
        let permissions_list = []
        const decoded = await request.jwtVerify()
        request.userID = decoded.sub
        const permissions = await getPermissionsRolesByID(decoded.sub)
        for (let i = 0; i < permissions.length; i++) {
            permissions_list = permissions_list.concat(permissions[i].permission_id);
        }

        request.permissions = permissions_list
    } catch (err) {
        return reply.status(401).send({ error: 'Token inválido ou expirado' })
    }
})
server.decorate('checkPermissions',function (required_permission) {
    return async (request, reply) => {
        try{
            const permissionsID = await getPermissionByName(required_permission)
            if (!permissionsID) {
                return reply.status(404).send({message:'No permissions found for this user'})
            }
            if (!request.permissions.includes(permissionsID[0].id)) {
                return reply.status(401).send({message:'Not authorized'})
            }
        }catch(e){
            return reply.status(500).send({message:'Internal Server Error'})
        }
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
server.register(churchesRoutes)
server.register(generalRoutes)

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
