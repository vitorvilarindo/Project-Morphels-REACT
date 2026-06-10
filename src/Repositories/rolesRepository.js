import {sql} from "../../db.js";

export class RolesRepository {
    async createRole (roleData, userId) {
        return await sql`INSERT INTO roles (name, description, institution)
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
                                  JOIN institions i ON r.institution = i.id
                                  JOIN sectors us ON i.id = us.institution
                                  JOIN branches ub ON us.id = ub.sector
                                  JOIN users u ON ub.id = u.branch
                         WHERE u.id = ${userId}`
    }


    async updateRole(data, id){
        return await sql`UPDATE roles
                         SET name        = ${data.name},
                             description = ${data.description},
                             WHERE id = ${id}
                             RETURNING id`
    }
    async deleteRoles (roleId) {
        return await sql`DELETE FROM expenses 
                        WHERE id = ${roleId}`
    }
}