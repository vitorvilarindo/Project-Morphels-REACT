import { sql } from "../db.js"

// Criar role
export async function createRole(request, reply) {
    try {
        const {
            name,
            description,
            access_scope,
            permissions
        } = request.body

            const newRole = await sql`
          INSERT INTO roles (name, description)
          VALUES (${name}, ${description})
          RETURNING *
        `
        for (let permission of permissions) {
            const newPermission = await sql`
                INSERT INTO permissions (role_id, page_id, can_view, can_add, can_edit, can_delete, access_scope)
                VALUES (${newRole[0].id}
                        , (SELECT pg.id from pages pg WHERE pg.name = ${permission.page})
                        , ${permission.can_view ?? false}
                        , ${permission.can_add ?? false}
                        , ${permission.can_edit ?? false}
                        , ${permission.can_delete ?? false}
                        , ${access_scope ?? "local"})`
            console.log(newPermission)
        }

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
        SELECT id, name FROM roles WHERE name ILIKE ${"%" + search + "%"}
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

export async function getRole(role_id) {
    return await sql`SELECT name
                     FROM roles
                     WHERE id = ${role_id}`
}

// Editar role
export async function editRole(request, reply) {
    try {
        const { id } = request.params
        const {
            name,
            description,
            permissions
        } = request.body

        const updated = await sql`
          UPDATE roles
          SET name = ${name}, description = ${description}
          WHERE id = ${id}
          RETURNING *
        `
        for (let permission of permissions) {
            const newPermission = await sql`
        UPDATE permissions
        SET can_view = ${permission.can_view}
            , can_add = ${permission.can_add}
            , can_edit = ${permission.can_edit}
            , can_delete = ${permission.can_delete}`
            console.log(newPermission)
        }
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
        const deletedPermission = await sql`
            DELETE FROM permissions WHERE role_id = ${id}`
        const deleted = await sql`DELETE FROM roles WHERE id = ${id} RETURNING *`

        if (deleted.length === 0 || deletedPermission.length === 0) {
            return reply.status(404).send({ error: "Role não encontrada" })
        }
        return reply.send({ message: "Role removida com sucesso" })
    } catch (error) {
        console.error("Erro ao remover role:", error)
        return reply.status(500).send({ error: "Erro ao remover role" })
    }
}
