import { sql } from "../../db.js"
import { Listing, Filter, DeleteItem } from "../../Classes/crudClasses.js"

// Criar card
export async function createCard(request, reply) {
    try {
        const { code, member, issue_date, due_date, status } = request.body
        const newCard = await sql`
      INSERT INTO cards (code, member, issue_date, due_date, status)
      VALUES (${code}, ${member}, ${issue_date}, ${due_date}, ${status})
      RETURNING *
    `
        return reply.status(201).send(newCard[0])
    } catch (error) {
        console.error("Erro ao inserir card:", error)
        return reply.status(500).send({ error: "Erro ao criar card" })
    }
}

// Listar cards
export async function listCards(request, reply) {
    try {
        const cards = await new Listing(request.userID, request.query.search, request.access_scope).OnGetAndList()

        return reply.send(cards)
    } catch (error) {
        console.error("Erro ao listar cards:", error)
        return reply.status(500).send({ error: "Erro ao listar cards" })
    }
}

export async function filterCards(request, reply) {
    try {
        const {type, start_date, end_date} = request.body
        const revenues = await new Filter(request.userID, "cards", "", request.access_scope, type, start_date, end_date).OnFilterItems()

        return reply.status(200).send(revenues)
    } catch (error) {
        console.error("Erro ao filtrar receitas:", error)
        return reply.status(500).send({ error: "Erro ao filtrar receitas" })
    }
}

// Obter card específico
export async function getCard(card_id) {
    const card = await sql`SELECT * FROM cards WHERE id = ${card_id}`
    return card[0]
}

// Editar card
export async function editCard(request, reply) {
    try {
        const { id } = request.params
        const { code, member, issue_date, due_date, status } = request.body

        const updated = await sql`
      UPDATE cards
      SET 
        code = ${code}, 
        member = ${member}, 
        issue_date = ${issue_date}, 
        due_date = ${due_date}, 
        status = ${status}
      WHERE id = ${id}
      RETURNING *
    `
        if (updated.length === 0) {
            return reply.status(404).send({ error: "Card não encontrado" })
        }
        return reply.send(updated[0])
    } catch (error) {
        console.error("Erro ao editar card:", error)
        return reply.status(500).send({ error: "Erro ao editar card" })
    }
}

// Deletar card
export async function deleteCard(request, reply) {
    try {
        const deleted = await new DeleteItem(request.query.id, request.userID, "cards", request.access_scope)

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Card não encontrado" })
        }
        return reply.send({ message: "Card removido com sucesso" })
    } catch (error) {
        console.error("Erro ao remover card:", error)
        return reply.status(500).send({ error: "Erro ao remover card" })
    }
}