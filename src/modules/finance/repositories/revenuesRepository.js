import {sql} from "../../../../db.js";

export class RevenuesRepository {
    async createRevenue (revenuesData) {
        return sql`INSERT INTO revenues (member, type, value, payment, date, branch)
        VALUES(
               ${revenuesData.member},
               ${revenuesData.type},
               ${revenuesData.value},
               ${revenuesData.payment},
               ${revenuesData.date},
               ${revenuesData.branch}
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
                   ORDER BY r.date DESC LIMIT 999999
        `;
    }

    async listAllWithSectorPermission (userId, searchTerm, dates = null){
        return sql`
            SELECT r.*, SUM(r.value) OVER() as revenues_sum
            FROM revenues r
                     JOIN branches b ON r.branch = b.id
                     JOIN branches ub ON b.sector = ub.sector
                     JOIN users u ON u.branch = ub.id
            WHERE u.id = ${userId}
                ${searchTerm
                    ? sql`AND r.name ILIKE
                    ${searchTerm}`
                    : sql``}
                  ${dates ? sql`AND r.date BETWEEN ${dates.start_date} AND ${dates.end_date}` : sql``}
            ORDER BY r.date DESC LIMIT 999999
        `;
    }

    async listAllWithGlobalPermissions (userId, searchTerm, dates = null){
        return sql`SELECT r.*, SUM(r.value) OVER() as revenues_sum
                   FROM revenues r
                            JOIN branches b ON r.branch = b.id
                            JOIN sectors s on s.id = b.sector
                            JOIN sectors us ON s.institution = us.institution
                            JOIN branches ub ON us.id = ub.sector
                            JOIN users u ON u.branch = ub.id
                   WHERE u.id = ${userId} 
                       ${searchTerm ? sql`AND r.name ILIKE ${searchTerm}` : sql``}
                       ${dates ? sql`AND r.date BETWEEN ${dates.start_date} AND ${dates.end_date}` : sql``}
                   ORDER BY r.date DESC LIMIT 999999
        `;
    }

    async listGlobalSumValuesByYear (userId){
        return sql`SELECT TO_CHAR(r.date, 'YYYY') AS ano, TO_CHAR(r.date, 'MM') AS mes, SUM(r.value) AS valor_total
                   FROM revenues r
                            JOIN branches b ON r.branch = b.id
                            JOIN sectors s on s.id = b.sector
                            JOIN sectors us ON s.institution = us.institution
                            JOIN branches ub ON us.id = ub.sector
                            JOIN users u ON u.branch = ub.id
                   WHERE u.id = ${userId}
                   GROUP BY TO_CHAR(r.date, 'YYYY'), TO_CHAR(r.date, 'MM')
                   ORDER BY ano, mes;
            `
    }

    async updateRevenue(data, id, userId){
        return sql`UPDATE revenues r
                        SET member      = ${data.member},
                            type        = ${data.type},
                            value       = ${data.value},
                            payment     = ${data.payment},
                            date        = ${data.date},
                            branch      = ${data.branch}
                        WHERE r.id = ${id}
                          AND r.branch IN (
                            SELECT b.id
                            FROM branches b
                                     JOIN branches ub ON b.institution = ub.institution
                                     JOIN users u ON u.branch = ub.id
                            WHERE u.id = ${userId}
                        )
                        RETURNING r.id`;
    }
    async deleteRevenue (revenueId, userId) {
        return sql`DELETE FROM revenues r
                   WHERE r.id = ${revenueId}
                     AND r.branch IN (
                       SELECT b.id
                       FROM branches b
                                JOIN branches ub ON b.institution = ub.institution
                                JOIN users u ON u.branch = ub.id
                       WHERE u.id = ${userId}
                       )
                   RETURNING r.id
                   `;
    }
}