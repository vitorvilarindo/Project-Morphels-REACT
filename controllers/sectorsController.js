import { sql } from '../db.js' // sua conexão com o banco

export const listSectors = async (request, reply) => {
    try {
        let sectors
        const { search } = request.params
        if (!search){
            sectors = await sql`SELECT * FROM sectors`
        }else{
            sectors = await sql`SELECT * FROM sectors WHERE sector = ${search}`
        }
        return reply.send(sectors)
    } catch (err) {
        return reply.status(500).send({ error: 'Erro ao listar setores' })
    }
}


export const createSector = async (request, reply) => {
    try {
        const { sector, sectorial_cordenator, vice_sectorial_cordenator } = request.body
        const newSector = await sql`
      INSERT INTO sectors (sector, sectorial_cordenator, vice_sectorial_cordenator)
      VALUES (${sector}, ${sectorial_cordenator}, ${vice_sectorial_cordenator})
      RETURNING *
    `
        return reply.status(201).send(newSector[0])
    } catch (err) {
        return reply.status(500).send({ error: 'Erro ao criar setor' })
    }
}

export const updateSector = async (request, reply) => {
    try {
        const { id } = request.params
        const { sector, sectorial_cordenator, vice_sectorial_cordenator } = request.body
        const updated = await sql`
      UPDATE sectors
      SET sector = ${sector},
          sectorial_cordenator = ${sectorial_cordenator},
          vice_sectorial_cordenator = ${vice_sectorial_cordenator}
      WHERE id = ${id}
      RETURNING *
    `
        if (updated.length === 0) {
            return reply.status(404).send({ error: 'Setor não encontrado' })
        }
        return reply.send(updated[0])
    } catch (err) {
        return reply.status(500).send({ error: 'Erro ao atualizar setor' })
    }
}

export const deleteSector = async (request, reply) => {
    try {
        const { id } = request.params
        const deleted = await sql`DELETE FROM sectors WHERE id = ${id} RETURNING *`
        if (deleted.length === 0) {
            return reply.status(404).send({ error: 'Setor não encontrado' })
        }
        return reply.send({ message: 'Setor removido com sucesso' })
    } catch (err) {
        return reply.status(500).send({ error: 'Erro ao remover setor' })
    }
}
