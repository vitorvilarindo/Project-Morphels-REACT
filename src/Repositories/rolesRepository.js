import {sql} from "../../db.js";

export class RolesRepository {
    async createRole (roleData, userId) {
        return await sql`INSERT INTO expenses (name, description, institution)
        VALUES(
               ${roleData.name},
               ${roleData.description},
                (SELECT s.institution
                 FROM users u
                          JOIN branches b ON u.branch = b.id
                          JOIN sectors s ON b.sector = s.id
                 WHERE u.id = ${userId}
              )
        RETURNING id`
    }

    async listRoles(userId) {
        return await sql`SELECT r.*
                         FROM roles r
                                  JOIN institions i ON r.institution = i.institution
                                  JOIN sectors us ON i.id = us.institution
                                  JOIN branches ub = us.id = ub.sector
                                  JOIN users u ON ub.id = u.branch
                         WHERE u.id = ${userId}`
    }


    async updateRole(data){
        return await sql`UPDATE expenses
                         SET name        = ${data.name},
                             description = ${data.description},
                        RETURNING id`
    }
    async deleteRoles (expenseId, userId) {
        return await sql`DELETE FROM expenses 
                        WHERE id = ${expenseId}`
    }
}