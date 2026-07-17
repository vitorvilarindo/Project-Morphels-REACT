import {sql} from "../../db.js";

export class RevenuesRepository {
    async createRevenue (revenuesData) {
        return sql`INSERT INTO revenues (member, type, value, payment, date, branch)
        VALUES(
               ${revenuesData.member},
               ${revenuesData.type},
               ${revenuesData.value},
               ${revenuesData.payment},
               ${revenuesData.date},
                (SELECT id FROM branches WHERE name = ${revenuesData.branch})
              )
        RETURNING id`;
    }

    async listAllWithLocalPermission (userId, searchTerm, dates = null){
        return sql`SELECT r.*, SUM(r.value) OVER() as revenues_sum
                         FROM revenues r
                                  JOIN branches b ON r.branch = b.id
                                  JOIN users u ON u.branch = b.id
                         WHERE u.id = ${userId} 
                         ${searchTerm ? sql`AND r.name ILIKE ${searchTerm}`
            : sql``}
                               ${dates ? sql`AND r.date BETWEEN ${dates.start_date} AND ${dates.end_date}` : sql``}
                         `;
    }

    async listAllWithSectorPermission (userId, searchTerm, dates = null){
        return sql`
            SELECT r.*, SUM(r.value) OVER() as revenues_sum
            FROM revenues r
                     JOIN branches b ON r.branch = b.id
                     JOIN branches ub ON b.sector = ub.sector
                     JOIN users u ON u.branch = ub.id
            WHERE u.id = ${userId} ${searchTerm
                    ? sql`AND r.name ILIKE
                    ${searchTerm}`
                    : sql``}
                  ${dates ? sql`AND r.date BETWEEN ${dates.start_date} AND ${dates.end_date}` : sql``}
        `;
    }

    async listAllWithGlobalPermissions (userId, searchTerm, dates = null){
        console.log(dates)
        console.log(userId)
        return sql`SELECT r.*, SUM(r.value) OVER() as revenues_sum
                   FROM revenues r
                            JOIN branches b ON r.branch = b.id
                            JOIN sectors s on s.id = b.sector
                            JOIN sectors us ON s.institution = us.institution
                            JOIN branches ub ON us.id = ub.sector
                            JOIN users u ON u.branch = ub.id
                   WHERE u.id = ${userId} 
                       ${searchTerm ? sql`AND r.name ILIKE ${searchTerm}` : sql``}
                       ${dates ? sql`AND r.date BETWEEN ${"2026-07-01T00:00:00.000Z"} AND ${"2026-07-14T23:59:59.999Z"} ` : sql``}
                   `;
    }

    async updateRevenue(data, id){
        return sql`UPDATE revenues 
                        SET member      = ${data.member},
                            type        = ${data.type},
                            value       = ${data.value},
                            payment     = ${data.payment},
                            date        = ${data.date},
                            branch      = (SELECT id FROM branches WHERE name = ${data.branch})
                        WHERE id = ${id}
                        RETURNING id`;
    }
    async deleteRevenue (revenueId, userId) {
        return sql`DELETE FROM revenues r
                        JOIN branches b on r.branch = b.id
                        WHERE b.intitution = (SELECT intitution from users WHERE id = ${userId}  ) 
                        AND r.id = ${revenueId}`;
    }
}