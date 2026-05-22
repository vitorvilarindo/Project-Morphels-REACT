import {sql} from "../../db.js";

export class ExpensesRepository {
    async createRevenue (expensesData) {
        return await sql`INSERT INTO expenses (title, type, value, payment, date, beneficiary, branch)
        VALUES(
               ${expensesData.title},
               ${expensesData.type},
               ${expensesData.value},
               ${expensesData.payment},
               ${expensesData.date},
               ${expensesData.beneficiary},
                (SELECT id FROM branches WHERE name = ${expensesData.branch})
              )
        RETURNING id`
    }

    async listAllWithLocalPermission (userId, searchTerm){
        return await sql`SELECT e.*
                         FROM expenses e
                                  JOIN branches b ON e.branch = b.id
                                  JOIN users u ON b.id = u.church
                         WHERE u.id = ${userId} 
                         AND b.institution = u.institution 
                         ${searchTerm ? sql`AND e.name ILIKE ${searchTerm}`
            : sql``}`
    }

    async listAllWithSectorPermission (userId, searchTerm){
        return await sql`
                    SELECT e.*
                    FROM expenses e
                             JOIN branches b ON e.branch= b.id
                             JOIN users u ON c.sector = u.sector
                    WHERE u.id = ${userId}
                    AND b.institution = u.institution
                        ${searchTerm
            ? sql`AND e.name ILIKE ${searchTerm}`
            : sql``}
                `;
    }

    async listAllWithGlobalPermissions (userId, searchTerm){
        return await sql`SELECT e.*
                         FROM expenses e
                         JOIN branches b ON e.branch = b.id
                           WHERE b.institution = (
                           SELECT institution from users WHERE id = ${userId}
                        )
                             ${searchTerm
            ? sql`AND e.name ILIKE ${searchTerm}`
            : sql``}`;
    }

    async updateRevenue(data){
        return await sql`UPDATE expenses 
                        SET member      = ${data.member},
                            type        = ${data.type},
                            value       = ${data.value},
                            payment     = ${data.payment},
                            date        = ${data.date},
                            branch      = (SELECT id FROM branches WHERE name = ${data.branch})
                        WHERE id = ${data.id}
                        RETURNING id`
    }
    async deleteRevenue (expenseId, userId) {
        return await sql`DELETE FROM expenses e
                        JOIN branches b on e.branch = b.id
                        WHERE b.intitution = (SELECT intitution from users WHERE id = ${userId}  ) 
                        AND e.id = ${expenseId}`
    }
}