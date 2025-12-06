import {randomInt} from "node:crypto";
import {hash} from "bcrypt";
import { dataBasePostgresUsers } from "../controller/usersController.js";

const database_users = new dataBasePostgresUsers()

export default async function usersRoutes(server, opts){
    server.post('/users', async (request, reply) => {
        const { name, email, password } = request.body

        const randomSalt = randomInt(10, 16)
        const encryptedPassword = await hash(password, randomSalt)

        console.log(encryptedPassword, randomSalt)
        await database_users.create_user({
            name,
            email,
            encryptedPassword
        })
        reply.status(201).send()
        console.log("Deu bom")
    })

    server.post('/users/login', async (request, reply) => {
        try {
            const {loginEmail, loginPassword}  = request.body
            const response = await database_users.login(loginEmail, loginPassword)

            if (response.success === false) {
                return reply.status(400).send(response)
            }
            const token = server.jwt.sign({ user: loginEmail },{expiresIn: '1h'})
            console.log(token)

            reply.setCookie('token', token, {
                httpOnly: true,   // não acessível via JS (mais seguro)
                secure: false,     // só em HTTPS (em produção)
                sameSite: 'strict',
                path: '/'
            })
            return reply.status(200).send(response)
        }catch (error) {
            console.log(error)
        }

    })

    server.post('/users/profile', async (request, reply) => {
        try {
            const { token } = request.cookies
            console.log("aqui esta " + token)

            if (!token) {
                return reply.status(401).send({ error: 'Token ausente' })
            }

            const decoded = await server.jwt.verify(token)

            console.log("Deu bom" + decoded.user)

            return reply.status(200).send({ user: decoded.user })
        } catch (err) {
            return reply.status(401).send({ error: 'Token inválido ou expirado' })
        }
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
}