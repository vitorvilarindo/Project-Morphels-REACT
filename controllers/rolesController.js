import { sql } from "../db.js"

// Criar role
export async function createRole(request, reply) {
    try {
        const role = request.body
        const newRole = await sql`
      INSERT INTO roles (name, description)
      VALUES (${role.name}, ${role.description})
      RETURNING *
    `
        return reply.status(201).send(newRole[0])
    } catch (error) {
        console.error("Erro ao inserir role:", error)
        return reply.status(500).send({ error: "Erro ao criar role" })
    }
}

// Listar roles
export async function listRoles(request, reply) {
    try {
        const { search } = request.query
        let roles

        if (search) {
            roles = await sql`
        SELECT * FROM roles WHERE name ILIKE ${"%" + search + "%"}
      `
        } else {
            roles = await sql`SELECT * FROM roles`
        }

        return reply.send(roles)
    } catch (error) {
        console.error("Erro ao listar roles:", error)
        return reply.status(500).send({ error: "Erro ao listar roles" })
    }
}

// Editar role
export async function editRole(request, reply) {
    try {
        const { id } = request.params
        const { name, description } = request.body

        const updated = await sql`
      UPDATE roles
      SET name = ${name}, description = ${description}
      WHERE id = ${id}
      RETURNING *
    `
        if (updated.length === 0) {
            return reply.status(404).send({ error: "Role não encontrada" })
        }
        return reply.send(updated[0])
    } catch (error) {
        console.error("Erro ao editar role:", error)
        return reply.status(500).send({ error: "Erro ao editar role" })
    }
}

// Deletar role
export async function deleteRole(request, reply) {
    try {
        const { id } = request.params
        const deleted = await sql`DELETE FROM roles WHERE id = ${id} RETURNING *`

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Role não encontrada" })
        }
        return reply.send({ message: "Role removida com sucesso" })
    } catch (error) {
        console.error("Erro ao remover role:", error)
        return reply.status(500).send({ error: "Erro ao remover role" })
    }
}
