import {sql} from "../../../../db.js";

export class ReportsRepository {
    async createReports (reportsData, userId) {
        return sql`INSERT INTO reports (title, type, date, start_date, end_date, by, sector, branch, items)
        VALUES(
               ${reportsData.title},
               ${reportsData.type},
               ${reportsData.data},
               ${reportsData.start_date},
               ${reportsData.end_date},
               ${userId},
               (SELECT s.id FROM sectors s JOIN branches b ON b.sector = s.id WHERE b.id = ${reportsData.branch}),
               ${reportsData.branch},
               ${reportsData.options}
              )
        RETURNING id`;
    }

    async findReportsDataById (id) {
        return sql`SELECT * FROM reports WHERE id = ${id}`;
    }

    async listAllWithLocalPermission (userId, searchTerm) {
        return sql`SELECT r.*, ur.name as creator
                   FROM reports r
                            JOIN branches b ON r.branch = b.id
                            JOIN users u ON u.branch = b.id
                            LEFT JOIN users ur ON r.by = ur.id
                   WHERE u.id = ${userId} 
                       ${searchTerm ? sql`AND r.name ILIKE
                           ${searchTerm}`
            : sql``}`;
    }

    async listAllWithSectorPermission (userId, searchTerm){
        return sql`
            SELECT r.*, ur.name as creator
            FROM reports r
                     JOIN branches b ON r.branch = b.id
                     JOIN branches ub ON b.sector = ub.sector
                     JOIN users u ON u.branch = ub.id
                     LEFT JOIN users ur ON r.by = ur.id
            WHERE u.id = ${userId};
            ${searchTerm
                    ? sql`AND r.name ILIKE
                    ${searchTerm}`
                    : sql``}
        `;
    }

    async listAllWithGlobalPermissions (userId, searchTerm){
        return sql`SELECT r.*, ur.name as creator
                   FROM reports r
                            JOIN branches b ON r.branch = b.id
                            JOIN sectors s ON s.id = b.sector
                            JOIN sectors us ON s.institution = us.institution
                            JOIN branches ub ON us.id = ub.sector
                            JOIN users u ON u.branch = ub.id
                            LEFT JOIN users ur ON r.by = ur.id
                   WHERE u.id = ${userId} ${searchTerm
                           ? sql`AND r.name ILIKE ${searchTerm}`
                           : sql``}`;
    }

    async updateReport(data, id){
        return sql`UPDATE reports 
                        SET member      = ${data.member},
                            type        = ${data.type},
                            value       = ${data.value},
                            payment     = ${data.payment},
                            date        = ${data.date},
                            branch      = (SELECT id FROM branches WHERE name = ${data.branch})
                        WHERE id = ${id}
                        RETURNING id`;
    }
    async deleteReports (reportsId) {
        return sql`DELETE FROM reports 
                        WHERE id = ${reportsId}
                            RETURNING id
                        `;
    }
}