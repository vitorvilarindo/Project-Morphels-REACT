import { sql } from "../db.js"

// Criar permissão
export async function createPermission(request, reply) {
    try {
        const permission = request.body
        const newPermission = await sql`
      INSERT INTO permissions (name, description)
      VALUES (${permission.name}, ${permission.description})
      RETURNING *
    `
        return reply.status(201).send(newPermission[0])
    } catch (error) {
        console.error("Erro ao inserir permissão:", error)
        return reply.status(500).send({ error: "Erro ao criar permissão" })
    }
}

// Listar permissões
export async function listPermissions(request, reply) {
    try {
        const { search } = request.query
        let permissions

        if (search) {
            permissions = await sql`
        SELECT * FROM permissions WHERE name ILIKE ${"%" + search + "%"}
      `
        } else {
            permissions = await sql`SELECT * FROM permissions`
        }

        return reply.send(permissions)
    } catch (error) {
        console.error("Erro ao listar permissões:", error)
        return reply.status(500).send({ error: "Erro ao listar permissões" })
    }
}

// Editar permissão
export async function editPermission(request, reply) {
    try {
        const { id } = request.params
        const { name, description } = request.body

        const updated = await sql`
      UPDATE permissions
      SET name = ${name}, description = ${description}
      WHERE id = ${id}
      RETURNING *
    `
        if (updated.length === 0) {
            return reply.status(404).send({ error: "Permissão não encontrada" })
        }
        return reply.send(updated[0])
    } catch (error) {
        console.error("Erro ao editar permissão:", error)
        return reply.status(500).send({ error: "Erro ao editar permissão" })
    }
}

// Deletar permissão
export async function deletePermission(request, reply) {
    try {
        const { id } = request.params
        const deleted = await sql`DELETE FROM permissions WHERE id = ${id} RETURNING *`

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Permissão não encontrada" })
        }
        return reply.send({ message: "Permissão removida com sucesso" })
    } catch (error) {
        console.error("Erro ao remover permissão:", error)
        return reply.status(500).send({ error: "Erro ao remover permissão" })
    }
}
