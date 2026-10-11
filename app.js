import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'

import {financeModule} from "./src/modules/finance/index.js";
import {globalModule} from "./src/modules/global/index.js";
import {managerModule} from "./src/modules/manager/index.js";
import {rhModule} from "./src/modules/rh/index.js";

import containerPlugin from "./src/Services/containerPlugin.js";
import {sql} from "./db.js";

export async function buildApp() {
    const server = Fastify({ logger: process.env.NODE_ENV !== 'test' })

    // CORS primeiro
    await server.register(cors, {
        origin: process.env.ORING,
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        credentials: true
    })

    // Rate Limit
    await server.register(rateLimit, {
        global: false,
    })

    // JWT e cookies
    await server.register(jwt, {
        secret: process.env.JWT_SECRET_KEY,
        cookie: {
            cookieName: 'token',
            signed: false
        } })

    await server.register(cookie)
    await server.register(containerPlugin)

    // Middlewares
    server.addHook('preHandler', async (request, reply) => {
        if (request.method === 'OPTIONS') {
            return reply.status(204).send();
        }

        const publicRoutes = ['/users/login'];
        if (publicRoutes.includes(request.url)) {
            return;
        }

        try {
            const decoded = await request.jwtVerify();
            request.userID = decoded.sub;
            request.userBranch = decoded.branch;
        } catch (err) {
            return reply.status(401).send({ error: 'Invalid or expired token.' });
        }
    });

    const ACTIONS = new Set(['can_view', 'can_add', 'can_edit', 'can_delete']);

    server.decorate('checkPermissions', (action) => {
        if (!ACTIONS.has(action)) throw new Error(`Ação inválida: ${action}`); // falha ao subir o servidor
        return async (request, reply) => {
            const pageName = (request.routeOptions?.url ?? request.url.split('?')[0]).split('/')[1];
            const [perm] = await sql`
            SELECT p.can_view, p.can_add, p.can_edit, p.can_delete, p.access_scope
            FROM users u
                     JOIN permissions p ON p.role_id = u.designation
                     JOIN pages pg ON pg.id = p.page_id
            WHERE u.id = ${request.userID}
              AND pg.name = ${pageName}`;

            if (!perm || perm[action] !== true) return reply.status(403).send({message: 'Você não possui permissão para executar essa ação'});
            request.access_scope = perm.access_scope;
        };
    });

    // Rotas
    server.register(financeModule)
    server.register(managerModule)
    server.register(globalModule)
    server.register(rhModule)
    server.get("/health", async (request, reply) => {
        return reply.status(200).send({"message": "O usuário está autenticado"})
    })

    return server;
}