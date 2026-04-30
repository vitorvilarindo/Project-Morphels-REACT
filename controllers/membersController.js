import { sql } from "../db.js";
import {Listing} from "../Classes/List.js";

// Criar Membro
export async function createMember(request, reply) {
    try {
        const { name, cellphone, date_birth, pixkey, pixtype, church } = request.body;

        // Note: Adicionei 'church' pois é necessário para o sistema de permissões funcionar na listagem
        const newMember = await sql`
            INSERT INTO members (name, cellphone, date_birth, pixkey, pixtype, church)
            VALUES (${name}, ${cellphone}, ${date_birth}, ${pixkey}, ${pixtype}, ${church})
            RETURNING *
        `;

        return reply.status(201).send(newMember[0]);
    } catch (error) {
        console.error("Erro ao criar membro:", error);
        return reply.status(500).send({ error: "Erro ao criar membro" });
    }
}

// Listar Membros com Níveis de Permissão
export async function listMembers(request, reply) {
    try {
        const { search } = request.query;
        const listing = await new Listing(request.userID, "members", search, request.access_scope).OnGetAndList()

        return reply.status(200).send(listing);
    } catch (error) {
        console.error("Erro ao listar membros:", error);
        return reply.status(500).send({ error: "Erro ao listar membros" });
    }
}

// Editar Membro
export async function editMember(request, reply) {
    try {
        const { id } = request.params;
        const { name, cellphone, date_birth, pixkey, pixtype, church } = request.body;

        const updated = await sql`
            UPDATE members 
            SET name = ${name}, 
                cellphone = ${cellphone}, 
                date_birth = ${date_birth}, 
                pixkey = ${pixkey}, 
                pixtype = ${pixtype},
                church = ${church}
            WHERE id = ${id}
            RETURNING *
        `;

        if (updated.length === 0) {
            return reply.status(404).send({ error: "Membro não encontrado" });
        }

        return reply.status(204).send();
    } catch (error) {
        console.error("Erro ao editar membro:", error);
        return reply.status(500).send({ error: "Erro ao editar membro" });
    }
}

// Deletar Membro
export async function deleteMember(request, reply) {
    try {
        const { id } = request.params;
        const deleted = await sql`DELETE FROM members WHERE id = ${id} RETURNING *`;

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Membro não encontrado" });
        }

        return reply.status(204).send();
    } catch (error) {
        console.error("Erro ao remover membro:", error);
        return reply.status(500).send({ error: "Erro ao remover membro" });
    }
}