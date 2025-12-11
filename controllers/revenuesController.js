import { sql } from "../db.js"
import {getPermissionByName} from "./permissionsController.js";

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
        const { search } = request.query
        let revenues
        let indice
        const viewPermissions = ["general_preview", "sectorial_preview", "local_preview"];
        for (let i = 0; i < viewPermissions.length; i++) {
            const permissionsID = await getPermissionByName(viewPermissions[i])
            if (request.permissions.includes(permissionsID[0].id)) {
                 indice = viewPermissions[i].indexOf(permissionsID[0].id)
            }
        }

        switch (indice) {
            case 0:
                if (search) {
                    revenues = await sql`
                SELECT * FROM revenues WHERE member ILIKE ${"%" + search + "%"}
            `
                } else {
                    revenues = await sql`SELECT * FROM revenues`
                }
                break
            case 1:
                if(search) {
                    revenues = await sql`
                    SELECT r.* FROM churchs c JOIN revenues r ON r.church = c.id JOIN users u ON c.sector = u.sector WHERE u.id = ${request.userID} AND r.member ILIKE ${"%" + search + "%"}
                    `
                }else {
                    revenues = await sql`
                    SELECT r.* FROM churchs c JOIN revenues r ON r.church = c.id JOIN users u ON c.sector = u.sector WHERE u.id = ${request.userID}
                    `
                }
                break
            case 2:
                if(search) {
                    revenues = await sql`SELECT r.* FROM churchs c JOIN revenues r ON r.church = c.id JOIN users u ON c.id = u.church WHERE u.id = ${request.userID}`
                }
        }


        return reply.status(200).send(revenues)
    } catch (error) {
        console.error("Erro ao listar receitas:", error)
        return reply.status(500).send({ error: "Erro ao listar receitas" })
    }
}

// Filtrar receitas por tipo e intervalo de datas
export async function filterRevenues(request, reply) {
    try {
        let { type, date1: start_date, date2: end_date } = request.query

        if (type === "All") {
            type = ""
        }

        if (start_date === "") {
            const revenues_date = await sql`SELECT date FROM revenues`
            const timestamps = revenues_date.map(d => new Date(d.date).getTime())
            start_date = new Date(Math.min(...timestamps))
        }

        if (end_date === "") {
            const revenues_date = await sql`SELECT date FROM revenues`
            const timestamps = revenues_date.map(d => new Date(d.date).getTime())
            end_date = new Date(Math.max(...timestamps))
        }

        const revenues = await sql`
            SELECT *
            FROM revenues
            WHERE type ILIKE '%' || ${type} || '%'
              AND date BETWEEN ${start_date}::date AND ${end_date}::date
        `
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
        const { id } = request.params
        const deleted = await sql`DELETE FROM revenues WHERE id = ${id} RETURNING *`

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Receita não encontrada" })
        }
        return reply.status(204).send()
    } catch (error) {
        console.error("Erro ao remover receita:", error)
        return reply.status(500).send({ error: "Erro ao remover receita" })
    }
}
