import { sql } from "../db.js"

// Criar church
export async function createChurch(request, reply) {
    try {
        const church = request.body
        const sectorID = await sql`SELECT id FROM sectors WHERE sector = ${church.sector}`
        const newChurch = await sql`
      INSERT INTO churchs (name, sector, shepherd)
      VALUES (${church.name}, ${sectorID[0].id}, ${church.shepherd})
      RETURNING *
    `
        return reply.status(201).send(newChurch[0])
    } catch (error) {
        console.error("Erro ao inserir church:", error)
        return reply.status(500).send({ error: "Erro ao criar church" })
    }
}

// Listar churchs
export async function listChurchs(request, reply) {
    try {
        const { search } = request.query
        let churchs

        if (search) {
            churchs = await sql`
        SELECT * FROM churchs 
        WHERE name ILIKE ${"%" + search + "%"}
        OR sector ILIKE ${"%" + search + "%"}
        OR shepherd ILIKE ${"%" + search + "%"}
      `
        } else {
            churchs = await sql`SELECT * FROM churchs`
        }

        return reply.send(churchs)
    } catch (error) {
        console.error("Erro ao listar churchs:", error)
        return reply.status(500).send({ error: "Erro ao listar churchs" })
    }
}

// Editar church
export async function editChurch(request, reply) {
    try {
        const { id } = request.params
        const { name, sector, shepherd } = request.body
        const sectorID = await sql`SELECT id FROM sectors WHERE sector = ${sector}`

        const updated = await sql`
      UPDATE churchs
      SET name = ${name}, sector = ${sectorID[0].id}, shepherd = ${shepherd}
      WHERE id = ${id}
      RETURNING *
    `
        if (updated.length === 0) {
            return reply.status(404).send({ error: "Church não encontrada" })
        }
        return reply.send(updated[0])
    } catch (error) {
        console.error("Erro ao editar church:", error)
        return reply.status(500).send({ error: "Erro ao editar church" })
    }
}

// Deletar church
export async function deleteChurch(request, reply) {
    try {
        const { id } = request.params
        const deleted = await sql`
      DELETE FROM churchs WHERE id = ${id} RETURNING *
    `

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Church não encontrada" })
        }
        return reply.send({ message: "Church removida com sucesso" })
    } catch (error) {
        console.error("Erro ao remover church:", error)
        return reply.status(500).send({ error: "Erro ao remover church" })
    }
}
