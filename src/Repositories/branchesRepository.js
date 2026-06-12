import {sql} from "../../db.js";

export class BranchesRepository {
    async createBranch (branchdata, userId) {
        return await sql`INSERT INTO branches (name, sector, owner, insitution)
        VALUES(
               ${branchdata.name},
               (SELECT id FROM sectors WHERE name = ${branchdata.sector}),
               ${branchdata.owner}
                (SELECT s.institution
                 FROM users u
                          JOIN branches b ON u.branch = b.id
                          JOIN sectors s ON b.sector = s.id
                 WHERE u.id = ${userId}
              )
        RETURNING id`
    }

    async findBranchById(branchId) {
        const [branch] = await sql`SELECT *
                                   FROM branches
                                   WHERE id = ${branchId}`
    }

    async listBranches(userId) {
        return await sql`SELECT bb.*
                         FROM branches bb
                                  JOIN institions i ON bb.institution = i.id
                                  JOIN sectors us ON i.id = us.institution
                                  JOIN branches ub ON us.id = ub.sector
                                  JOIN users u ON ub.id = u.branch
                         WHERE u.id = ${userId}`
    }


    async updateBranch (data){
        return await sql`UPDATE branches
                         SET name        = ${data.name},
                             description = ${data.description},
                        RETURNING id`
    }
    async deleteBranch (roleId) {
        return await sql`DELETE FROM expenses 
                        WHERE id = ${roleId}`
    }
}