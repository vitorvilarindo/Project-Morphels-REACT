import {sql} from "../../db.js";

export class ReportsRepository {
    async createReports (reportsData) {
        return await sql`INSERT INTO reports (title, type, data, start_date, end_date, by, sector, branch, items)
        VALUES(
               ${reportsData.title},
               ${reportsData.type},
               ${reportsData.data},
               ${reportsData.star_date},
               ${reportsData.end_date},
               ${reportsData.by},
               (SELECT s.id FROM sectors s JOIN branches b ON b.sector = s.id WHERE b.name = ${reportsData.branch})
                (SELECT id FROM branches WHERE name = ${reportsData.branch})
              )
        RETURNING id`
    }

    async listAllWithLocalPermission (userId, searchTerm){
        return await sql`SELECT r.*
                         FROM reports r
                                  JOIN branches b ON r.branch = b.id
                                  JOIN users u ON u.branch = b.id
                         WHERE u.id = ${userId} 
                         ${searchTerm ? sql`AND e.name ILIKE ${searchTerm}`
            : sql``}`
    }

    async listAllWithSectorPermission (userId, searchTerm){
        return await sql`
            SELECT r.*
            FROM reports r
                     JOIN branches b ON r.branch = b.id
                     JOIN branches ub ON b.sector = ub.sector
                     JOIN users u ON u.branch = ub.id
            WHERE u.id = ${userId};
                        ${searchTerm
            ? sql`AND e.name ILIKE ${searchTerm}`
            : sql``}
                `;
    }

    async listAllWithGlobalPermissions (userId, searchTerm){
        return await sql`SELECT r.*
                         FROM reports r
                                  JOIN branches b ON e.branch = b.id
                                  JOIN sectors s ON s.id = b.sector
                                  JOIN sectors us ON s.institution = ub.sector
                                  JOIN branches ub ON us.is = ub.sector
                                  JOIN users u ON u.branch = ub.id
                         WHERE u.id = ${userId} ${searchTerm
            ? sql`AND e.name ILIKE
                                 ${searchTerm}`
            : sql``}`;
    }

    async updateReport(data, id){
        return await sql`UPDATE reports 
                        SET member      = ${data.member},
                            type        = ${data.type},
                            value       = ${data.value},
                            payment     = ${data.payment},
                            date        = ${data.date},
                            branch      = (SELECT id FROM branches WHERE name = ${data.branch})
                        WHERE id = ${id}
                        RETURNING id`
    }
    async deleteReports (expenseId) {
        return await sql`DELETE FROM reports 
                        WHERE id = ${expenseId}`
    }
}