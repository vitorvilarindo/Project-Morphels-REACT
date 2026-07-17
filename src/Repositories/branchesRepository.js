import {sql} from "../../db.js";

export class BranchesRepository {
    async createBranch (branch_data, userId) {
        return sql`INSERT INTO branches (name, sector, owner, insitution)
        VALUES(
               ${branch_data.name},
               (SELECT id FROM sectors WHERE name = ${branch_data.sector}),
               ${branch_data.owner}
                (SELECT s.institution
                 FROM users u
                          JOIN branches b ON u.branch = b.id
                          JOIN sectors s ON b.sector = s.id
                 WHERE u.id = ${userId}
              )
        RETURNING id`;
    }

    async findBranchById(branchId) {
        const [branch] = await sql`SELECT *
                                   FROM branches
                                   WHERE id = ${branchId}`
        return branch
    }

    async listAllWithLocalPermission (userId, searchTerm = null) {
        return sql`
            SELECT b.*
            FROM branches b
                     JOIN users u ON u.branch = b.id
            WHERE u.id = ${userId}
                ${searchTerm ? sql`AND b.nome ILIKE ${searchTerm}` : sql``}
        `;
    }

    async listAllWithSectorPermission (userId, searchTerm = null) {

        return sql`
        SELECT b.*
        FROM branches b
        JOIN branches ub ON b.sector = ub.sector
        JOIN users u ON u.branch = ub.id
        WHERE u.id = ${userId}
        ${searchTerm ? sql`AND b.nome ILIKE ${searchTerm}` : sql``}
    `;
    }

    async listAllWithGlobalPermissions (userId, searchTerm = null) {

        return sql`
        SELECT b.*
        FROM branches b
        JOIN branches ub ON b.institution = ub.institution
        JOIN users u ON u.branch = ub.id
        WHERE u.id = ${userId}
        ${searchTerm ? sql`AND b.nome ILIKE ${searchTerm}` : sql``}
    `;
    }

    async updateBranch (data){
        return sql`UPDATE branches
                         SET name        = ${data.name},
                             description = ${data.description},
                        RETURNING id`;
    }
    async deleteBranch (roleId) {
        return sql`DELETE FROM expenses 
                        WHERE id = ${roleId}`;
    }
}