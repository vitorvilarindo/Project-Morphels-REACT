import bcrypt from "bcrypt"
import { sql } from "../db.js"
import { getRole } from './rolesController.js'

// Criar usuário
export async function createUser(request, reply) {
    try {
        const {name, email, password, phone_number, designation, sector, church, sing_up_date} = request.body

        // Buscar IDs de role e sector
        const designationID = await sql`SELECT id FROM roles WHERE name = ${designation}`
        const sectorID = await sql`SELECT id FROM sectors WHERE sector = ${sector}`
        const churchID = await sql`SELECT id FROM churchs WHERE name = ${church}`

        if (!designationID || !sectorID) {
            return reply.status(400).send({ error: "Role or sector invalid" })
        }

        // Criptografar senha
        const encryptedPassword = await bcrypt.hash(password, 10)

        const newUser = await sql`
      INSERT INTO users (name, email, password, designation, sector, church, last_access, sing_up_date)
      VALUES (${name}, ${email}, ${encryptedPassword}, ${designationID[0]?.id}, ${sectorID[0]?.id}, ${churchID[0]?.id}, ${sing_up_date})
    `
        return reply.status(201).send()
    } catch (err) {
        console.error(err)
        return reply.status(500).send({ error: "Erro ao criar usuário" })
    }
}

// Login
export async function listUsers(request, reply) {
    try{
        const { search } = request.query
        const users = await sql`SELECT name, email, designation, last_access, sing_up_date FROM users`
        let users_formated = []
        for (const user of users) {
            const designation_name = await getRole(user.designation)
            users_formated = [...users_formated, {name: user.name, email: user.email, designation: designation_name[0]?.name, last_access: user.last_access, sing_up_date: user.sing_up_date }]
        }
        console.log(users_formated)

        return reply.status(200).send(users_formated)
    }catch(err){
        console.error(err)
        return reply.status(500).send({error: err.message})
    }
}
export async function login(request, reply) {
    try {
        const { loginEmail, loginPassword } = request.body

        // Busca usuário pelo email
        const user = await sql`SELECT id, password, designation FROM users WHERE email = ${loginEmail}`

        if (user.length === 0 || !user[0].password) {
            return reply.status(400).send({ success: false, route: "/" })
        }

        // Valida senha
        const isValidPassword = await bcrypt.compare(loginPassword, user[0].password)
        if (!isValidPassword) {
            return reply.status(401).send({ success: false, route: "/" })
        }

        // Cria token JWT
        const token = reply.server.jwt.sign(
            { sub: user[0].id, user: loginEmail },
            { expiresIn: "1h" }
        )

        // Seta cookie com token
        reply.setCookie("token", token, {
            httpOnly: true,
            secure: false, // em produção use true
            sameSite: "strict",
            path: "/"
        })

        request.designation = user[0].designation

        return reply.send({
            success: true,
            route: "/main",
        })
    } catch (err) {
        console.error(err)
        return reply.status(500).send({ error: "Erro no login" })
    }
}
export async function profile(request, reply) {
    try{
        const decoded = request.jwtVerify()
        request.userID = decoded.sub
        return reply.status(200)
    }catch(err){
        console.error(err)
        return reply.status(401)
    }
}


// Editar usuário
export async function editUser(request, reply) {
    try {
        const { id } = request.params
        const { name, email, password } = request.body

        const encryptedPassword = password ? await bcrypt.hash(password, 10) : null

        const updated = await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, password = ${encryptedPassword}
      WHERE id = ${id}
      RETURNING *
    `
        if (updated.length === 0) {
            return reply.status(404).send({ error: "Usuário não encontrado" })
        }
        return reply.send(updated[0])
    } catch (err) {
        console.error(err)
        return reply.status(500).send({ error: "Erro ao editar usuário" })
    }
}

// Deletar usuário
export async function deleteUser(request, reply) {
    try {
        const { id } = request.params
        const deleted = await sql`DELETE FROM users WHERE id = ${id} RETURNING *`

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Usuário não encontrado" })
        }
        return reply.send({ message: "Usuário removido com sucesso" })
    } catch (err) {
        console.error(err)
        return reply.status(500).send({ error: "Erro ao remover usuário" })
    }
}
