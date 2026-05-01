import {sql} from "../db.js";

export class Listing {
    constructor(userID, path, search, access_scope) {
        this.userID = userID
        this.path = path;
        this.search = search
        this.access_scope = access_scope
    }

    async OnGetAndList() {
        try {
            // 1. Preparamos o termo de busca fora da query
            const searchTerm = this.search ? `%${this.search}%` : null;

            // 2. O nome da tabela precisa ser tratado como um identificador
            // Usamos sql.unsafe para garantir que a string do path vire parte do SQL
            const table = sql.unsafe(this.path);

            let response;

            if (this.access_scope.has_permission === "global") {
                response = await sql`
                    SELECT *
                    FROM ${table}
                             ${searchTerm
                                     ? sql`WHERE member ILIKE ${searchTerm}`
                                     : sql``}
                `;
            } else if (this.access_scope.has_permission === "sector") {
                response = await sql`
                    SELECT r.*
                    FROM ${table} r
                             JOIN churchs c ON r.church = c.id
                             JOIN users u ON c.sector = u.sector
                    WHERE u.id = ${this.userID}
                        ${searchTerm
                                ? sql`AND r.member ILIKE ${searchTerm}`
                                : sql``}
                `;
            }else if (this.access_scope.has_permission === "local"){
                response = await sql`SELECT r.*
                                     FROM ${table} r
                                              JOIN churchs c ON r.church = c.id
                                              JOIN users u ON c.id = u.church
                                     WHERE u.id = ${this.userID} ${searchTerm 
                                             ? sql`AND r.member ILIKE ${"%" + searchTerm + "%"}` 
                                             : sql``}`
            }            console.log(response);
            return response;

        } catch (e) {
            console.error("Erro na consulta de listagem:", e);
            throw e;
        }
    }

}