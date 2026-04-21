import { sql } from "../db.js";

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
        let members;
        let indice;

        const viewPermissions = ["general_preview", "sectorial_preview", "local_preview"];

        // Lógica de verificação de permissão
        for (let i = 0; i < viewPermissions.length; i++) {
            const permissions = await getPermissionByName(viewPermissions[i]);
            if (permissions.length > 0 && request.permissions.includes(permissions[0].id)) {
                indice = i;
                break;
            }
        }

        switch (indice) {
            case 0: // Geral: Vê tudo
                if (search) {
                    members = await sql`SELECT * FROM members WHERE name ILIKE ${"%" + search + "%"}`;
                } else {
                    members = await sql`SELECT * FROM members`;
                }
                break;
            case 1: // Setorial: Vê membros das igrejas do mesmo setor
                const querySector = search ?
                    sql`SELECT m.* FROM churchs c JOIN members m ON m.church = c.id JOIN users u ON c.sector = u.sector WHERE u.id = ${request.userID} AND m.name ILIKE ${"%" + search + "%"}` :
                    sql`SELECT m.* FROM churchs c JOIN members m ON m.church = c.id JOIN users u ON c.sector = u.sector WHERE u.id = ${request.userID}`;
                members = await querySector;
                break;
            case 2: // Local: Vê membros apenas da sua própria igreja
                const queryLocal = search ?
                    sql`SELECT m.* FROM churchs c JOIN members m ON m.church = c.id JOIN users u ON c.id = u.church WHERE u.id = ${request.userID} AND m.name ILIKE ${"%" + search + "%"}` :
                    sql`SELECT m.* FROM churchs c JOIN members m ON m.church = c.id JOIN users u ON c.id = u.church WHERE u.id = ${request.userID}`;
                members = await queryLocal;
                break;
            default:
                members = [];
        }

        return reply.status(200).send(members);
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