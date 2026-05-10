import {sql} from "../db.js";

export class Listing {
    constructor(userID, path, search = "", access_scope) {
        this.userID = userID
        this.path = path;
        this.search = search
        this.access_scope = access_scope
    }

    async OnGetAndList() {
        try {
            const searchTerm = this.search ? `%${this.search}%` : null;

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
            }else if (this.access_scope.has_permission === "local") {
                response = await sql`SELECT r.*
                                     FROM ${table} r
                                              JOIN churchs c ON r.church = c.id
                                              JOIN users u ON c.id = u.church
                                     WHERE u.id = ${this.userID} ${searchTerm
                                             ? sql`AND r.member ILIKE
                                             ${searchTerm}`
                                             : sql``}`
            }
            return response;

        } catch (e) {
            console.error("Erro na consulta de listagem:", e);
            throw e;
        }
    }

}

export class Filter extends Listing {

    constructor(userID, path, search, access_scope, type, start_date, end_date) {
        super(userID, path, search, access_scope);
        this.type = type ? type : "";
        this.start_date = start_date ? start_date : new Date();
        this.end_date = end_date ? end_date : new Date();
    }

    async OnFilterItems (){
        try{
            const items = await this.OnGetAndList();

            console.log("Dados recebidos do banco:", items);

            if (!items || !Array.isArray(items)) {
                console.warn("Nenhum item encontrado ou erro na permissão.");
                return [];
            }

            return items.filter((item) => {
                const itemDate = new Date(item.date).getTime();
                const start = new Date(this.start_date).getTime();
                const end = new Date(this.end_date).getTime();

                const matchType = this.type? item.type === this.type: true
                const matchStart = this.start_date? itemDate >= start: true
                const matchEnd = this.end_date? itemDate <= end: true

                return matchType && matchStart && matchEnd;
            });
        }catch(err){
            console.error("Erro na consulta de listagem:", err);
        }

}
}

export class DeleteItem {
    constructor(itemID, userID, path, access_scope) {
        this.itemID = itemID;
        this.userID = userID;
        this.path = path;
        this.access_scope = access_scope;
    }

    async OnDeleteItem () {
        try {
            const table = sql.unsafe(this.path);

            return await sql`DELETE FROM ${table} WHERE id = ${this.itemID} RETURNING *`
        } catch (error) {
            console.error("Erro ao remover card:", error)
        }


    }
}