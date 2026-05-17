import {sql} from "../../db.js";

export class RevenuesRepository {
    async createRevenue (userData) {
        return await sql`INSERT INTO revenues (member, type, value, payment, date, branch, )
        VALUES(
               ${userData.member},
               ${userData.type},
               ${userData.value},
               ${userData.payment},
               NOW(),
                (SELECT id FROM branches WHERE name = ${userData.branch})
              )
        RETURNING id`
    }

    async listAllWithPermission (userId, accessScope, searchTerm) {
        return await sql`SELECT r.*
                         FROM revenue r
                                  JOIN branches b ON r.branch = b.id
                             ${accessScope === "sector"? sql`JOIN users u ON r.sector = u.sector`: sql``}
                            ${accessScope === "local" ? sql`JOIN users u ON b.id = u.branch`: sql``}}
                         WHERE u.id = ${userId}
                           AND b.institution = u.institution
                             ${searchTerm
                                     ? sql`AND r.name ILIKE ${searchTerm}`
                                     : sql``}`;
    }
}