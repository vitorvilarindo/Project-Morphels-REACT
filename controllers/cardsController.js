import { sql } from "../db.js"

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
        const { search } = request.query
        let cards

        if (search) {
            // Busca pelo código ou pelo nome do membro
            cards = await sql`
        SELECT * FROM cards 
        WHERE code ILIKE ${"%" + search + "%"} OR member ILIKE ${"%" + search + "%"}
      `
        } else {
            cards = await sql`SELECT * FROM cards`
        }

        return reply.send(cards)
    } catch (error) {
        console.error("Erro ao listar cards:", error)
        return reply.status(500).send({ error: "Erro ao listar cards" })
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
        const { id } = request.params
        const deleted = await sql`DELETE FROM cards WHERE id = ${id} RETURNING *`

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Card não encontrado" })
        }
        return reply.send({ message: "Card removido com sucesso" })
    } catch (error) {
        console.error("Erro ao remover card:", error)
        return reply.status(500).send({ error: "Erro ao remover card" })
    }
}