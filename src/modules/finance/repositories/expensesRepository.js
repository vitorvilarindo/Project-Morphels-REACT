import {sql} from "../../../../db.js";

export class ExpensesRepository {
    async createExpenses (expensesData) {
        return sql`INSERT INTO expenses (title, type, value, payment, date, beneficiary, branch)
        VALUES(
               ${expensesData.title},
               ${expensesData.type},
               ${expensesData.value},
               ${expensesData.payment},
               ${expensesData.date},
               ${expensesData.beneficiary},
               ${expensesData.branch}
              )
        RETURNING id`;
    }

    async listAllWithLocalPermission (userId, searchTerm, dates = null){
        return sql`SELECT e.*, SUM(e.value) as expenses_sum
                         FROM expenses e
                                  JOIN branches b ON e.branch = b.id
                                  JOIN users u ON u.branch = b.id
                         WHERE u.id = ${userId}
                         ${searchTerm ? sql`AND e.name ILIKE ${searchTerm}`
            : sql``}
                               ${dates ? sql`AND e.date BETWEEN ${dates.start_date} AND ${dates.end_date}` : sql``}
                   ORDER BY e.date DESC LIMIT 999999
        `;
    }

    async listAllWithSectorPermission (userId, searchTerm, dates = null){
        return sql`
            SELECT e.*, SUM(e.value) OVER() as expenses_sum
            FROM expenses e
                     JOIN branches b ON e.branch = b.id
                     JOIN branches ub ON b.sector = ub.sector
                     JOIN users u ON u.branch = ub.id
            WHERE u.id = ${userId};
            ${searchTerm
                    ? sql`AND e.name ILIKE
                    ${searchTerm}`
                    : sql``}
            ${dates ? sql`AND e.date BETWEEN ${dates.start_date} AND ${dates.end_date}` : sql``}
            ORDER BY e.date DESC LIMIT 999999
        `;
    }

    async listAllWithGlobalPermissions (userId, searchTerm, dates = null){
        return sql`SELECT e.*, SUM(e.value) OVER() as expenses_sum
                   FROM expenses e
                            JOIN branches b ON e.branch = b.id
                            JOIN sectors s ON s.id = b.sector
                            JOIN sectors us ON s.institution = us.institution
                            JOIN branches ub ON us.id = ub.sector
                            JOIN users u ON u.branch = ub.id
                   WHERE u.id = ${userId}
                       ${searchTerm
                           ? sql`AND e.name ILIKE
                           ${searchTerm}`
                           : sql``}
                         ${dates ? sql`AND e.date BETWEEN ${dates.start_date} AND ${dates.end_date}` : sql``}
                   ORDER BY e.date DESC LIMIT 999999
        `;
    }

    async updateExpenses(data, id){
        return sql`UPDATE expenses 
                        SET title      = ${data.title},
                            type        = ${data.type},
                            value       = ${data.value},
                            payment     = ${data.payment},
                            date        = ${data.date},
                            beneficity  = ${data.beneficiary}
                            branch      = ${data.branch}
                        WHERE id = ${id}
                        RETURNING id`;
    }
    async deleteExpenses (expenseId, userId) {
        return sql`DELETE FROM expenses e
                   WHERE e.id = ${expenseId}
                     AND e.branch IN (SELECT b.id
                                      FROM branches b
                                               JOIN branches ub ON b.institution = ub.institution
                                               JOIN users u ON u.branch = ub.id
                                      WHERE u.id = ${userId})
                       RETURNING id
                   `;
    }
}