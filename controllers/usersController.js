import bcrypt from "bcrypt"
import { sql } from "../db.js"

// Criar usuário
export async function createUser(request, reply) {
    try {
        const user = request.body

        // Buscar IDs de role e sector
        const designationRow = await sql`SELECT id FROM roles WHERE name = ${user.designation}`
        const sectorRow = await sql`SELECT id FROM sectors WHERE sector = ${user.sector}`

        const designationID = designationRow[0]?.id
        const sectorID = sectorRow[0]?.id

        if (!designationID || !sectorID) {
            return reply.status(400).send({ error: "Role ou setor inválido" })
        }

        // Criptografar senha
        const encryptedPassword = await bcrypt.hash(user.password, 10)

        const newUser = await sql`
      INSERT INTO users (name, email, password, designation, sector)
      VALUES (${user.name}, ${user.email}, ${encryptedPassword}, ${designationID}, ${sectorID})
      RETURNING *
    `
        return reply.status(201).send(newUser[0])
    } catch (err) {
        console.error(err)
        return reply.status(500).send({ error: "Erro ao criar usuário" })
    }
}

// Login
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
