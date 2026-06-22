import {sql} from "../../db.js";

export class CardsRepository {
    async createCards (cardsData) {
        return await sql`INSERT INTO members (code, member, issue_date, due_date, status)
        VALUES(
               ${cardsData.code},
               (SELECT id from members WHERE name = ${cardsData.member}),
               ${cardsData.issue_date},
               ${cardsData.due_date},
               ${cardsData.status}
              )
        RETURNING id`
    }

    async listAllWithLocalPermission (userId, searchTerm){
        return await sql`SELECT c.*
                         FROM cards c
                                  JOIN members m ON m.id = c.member
                                  JOIN branches b ON m.branch = b.id
                                  JOIN branches ub ON ub.id = b.id
                                  JOIN users u ON u.branch = ub.id
                         WHERE u.id = ${userId} ${searchTerm ? sql`AND e.name ILIKE ${searchTerm}`
            : sql``}`
    }

    async listAllWithSectorPermission (userId, searchTerm){
        return await sql`
            SELECT c.*
            FROM cards c
                     JOIN members m ON m.id = c.member
                     JOIN branches b ON m.branch = b.id
                     JOIN branches ub ON b.sector = ub.sector
                     JOIN users u ON u.branch = ub.id
            WHERE u.id = ${userId};
                        ${searchTerm
            ? sql`AND e.name ILIKE ${searchTerm}`
            : sql``}
                `;
    }

    async listAllWithGlobalPermissions (userId, searchTerm){
        return await sql`SELECT c.*
                         FROM cards c
                                  JOIN members m ON m.id = c.member
                                  JOIN branches b ON m.branch = b.id
                                  JOIN sectors s ON s.id = b.sector
                                  JOIN sectors us ON s.institution = us.institution
                                  JOIN branches ub ON us.id = ub.sector
                                  JOIN users u ON u.branch = ub.id
                         WHERE u.id = ${userId} ${searchTerm
            ? sql`AND e.name ILIKE
                                 ${searchTerm}`
            : sql``}`;
    }

    async updateCard(data, id){
        return await sql`UPDATE members 
                        SET code      = ${data.member},
                            member        = ${data.type},
                            issue_date         = ${data.value},
                            payment     = ${data.payment},
                            date        = ${data.date},
                            branch      = (SELECT id FROM branches WHERE name = ${data.branch})
                        WHERE id = ${id}
                        RETURNING id`
    }
    async deleteCard (cardId) {
        return await sql`DELETE FROM cards
                        WHERE id = ${cardId}`
    }
}