import { sql } from "../../db.js"
import {Listing, Filter, Delete} from "../../Classes/crudClasses.js";
import * as sea from "node:sea";

// Criar receita
export async function createRevenue(request, reply) {
    try {
        const { member, type, value, payment, date, church } = request.body
        const churchID = await sql`SELECT id FROM churchs WHERE name = ${church}`
        console.log(church)
        const newRevenue = await sql`
      INSERT INTO revenues (member, type, value, payment, date, church)
      VALUES (${member}, ${type}, ${value}, ${payment}, ${date}, ${churchID[0].id})
      RETURNING *
    `
        return reply.status(201).send(newRevenue[0])
    } catch (error) {
        console.error("Erro ao criar receita:", error)
        return reply.status(500).send({ error: "Erro ao criar receita" })
    }
}

// Listar receitas (com busca opcional)
export async function listRevenues(request, reply) {
    try {
        const revenues = await new Listing(request.userID, "revenues", request.query.search, request.access_scope).OnGetAndList()

        return reply.status(200).send(revenues)
    } catch (error) {
        console.error("Erro ao listar receitas:", error)
        return reply.status(500).send({ error: "Erro ao listar receitas" })
    }
}

// Filtrar receitas por tipo e intervalo de datas
export async function filterRevenues(request, reply) {
    try {
        const {type, start_date, end_date} = request.body
        const revenues = await new Filter(request.userID, "revenues", "", request.access_scope, type, start_date, end_date).OnFilterItems()

        return reply.status(200).send(revenues)
    } catch (error) {
        console.error("Erro ao filtrar receitas:", error)
        return reply.status(500).send({ error: "Erro ao filtrar receitas" })
    }
}

// Editar receita
export async function editRevenue(request, reply) {
    try {
        const { id } = request.params
        const { member, type, value, payment, date } = request.body

        const updated = await sql`
            UPDATE revenues
            SET member = ${member}, type = ${type}, value = ${value}, payment = ${payment}, date = ${date}
            WHERE id = ${id}
            RETURNING *
        `
        if (updated.length === 0) {
            return reply.status(404).send({ error: "Receita não encontrada" })
        }
        return reply.status(204).send()
    } catch (error) {
        console.error("Erro ao editar receita:", error)
        return reply.status(500).send({ error: "Erro ao editar receita" })
    }
}

// Deletar receita
export async function deleteRevenue(request, reply) {
    try {

        const deleted = await new Delete(request.params.id, request.userID, "revenues", request.access_scope).OnDeleteItem()

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Receita não encontrada" })
        }
        return reply.status(204).send()
    } catch (error) {
        console.error("Erro ao remover receita:", error)
        return reply.status(500).send({ error: "Erro ao remover receita" })
    }
}
