import { sql } from "../db.js"

// Criar recurso (página)
export async function createPage(request, reply) {
    try {
        const { name } = request.body
        const newResource = await sql`
      INSERT INTO pages (name)
      VALUES (${name})
      RETURNING *
    `
        return reply.status(201).send(newResource[0])
    } catch (error) {
        console.error("Erro ao inserir recurso:", error)
        return reply.status(500).send({ error: "Erro ao criar recurso" })
    }
}

// Listar recursos
export async function listPages(request, reply) {
    try {
        const { search } = request.query
        let pages

        if (search) {
            pages = await sql`
        SELECT * FROM pages 
        WHERE name ILIKE ${"%" + search + "%"}
      `
        } else {
            pages = await sql`SELECT * FROM pages`
        }

        return reply.send(pages)
    } catch (error) {
        console.error("Erro ao listar recursos:", error)
        return reply.status(500).send({ error: "Erro ao listar recursos" })
    }
}

// Obter recurso específico
export async function getResource(resource_id) {
    const resource = await sql`SELECT * FROM pages WHERE id = ${resource_id}`
    return resource[0]
}

// Editar recurso
export async function editPage(request, reply) {
    try {
        const { id } = request.params
        const { name } = request.body

        const updated = await sql`
      UPDATE pages
      SET name = ${name}
      WHERE id = ${id}
      RETURNING *
    `
        if (updated.length === 0) {
            return reply.status(404).send({ error: "Recurso não encontrado" })
        }
        return reply.send(updated[0])
    } catch (error) {
        console.error("Erro ao editar recurso:", error)
        return reply.status(500).send({ error: "Erro ao editar recurso" })
    }
}

// Deletar recurso
export async function deletePage(request, reply) {
    try {
        const { id } = request.params
        const deleted = await sql`DELETE FROM pages WHERE id = ${id} RETURNING *`

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Recurso não encontrado" })
        }
        return reply.send({ message: "Recurso removido com sucesso" })
    } catch (error) {
        console.error("Erro ao remover recurso:", error)
        return reply.status(500).send({ error: "Erro ao remover recurso" })
    }
}