import {sql} from "../../db.js";

export class MembersRepository {
    async createMember (membersData) {
        return await sql`INSERT INTO members (name, cellphone, date_birth, pixkey, pixtype, sector, branch)
        VALUES(
               ${membersData.name},
               ${membersData.cellphone},
               ${membersData.date_birth},
               ${membersData.pixkey},
               ${membersData.pixtype},
               (SELECT s.id FROM sectors s JOIN branches b ON b.sector = s.id WHERE b.name = ${membersData.branch})
                (SELECT id FROM branches WHERE name = ${membersData.branch})
              )
        RETURNING id`
    }

    async listAllWithLocalPermission (userId, searchTerm){
        return await sql`SELECT m.*
                         FROM members m
                                  JOIN branches b ON m.branch = b.id
                                  JOIN users u ON u.branch = b.id
                         WHERE u.id = ${userId} 
                         ${searchTerm ? sql`AND e.name ILIKE ${searchTerm}`
            : sql``}`
    }

    async listAllWithSectorPermission (userId, searchTerm){
        return await sql`
            SELECT m.*
            FROM members m
                     JOIN branches b ON m.branch = b.id
                     JOIN branches ub ON b.sector = ub.sector
                     JOIN users u ON u.branch = ub.id
            WHERE u.id = ${userId};
                        ${searchTerm
            ? sql`AND e.name ILIKE ${searchTerm}`
            : sql``}
                `;
    }

    async listAllWithGlobalPermissions (userId, searchTerm){
        return await sql`SELECT m.*
                         FROM members m
                                  JOIN branches b ON m.branch = b.id
                                  JOIN sectors s ON s.id = b.sector
                                  JOIN sectors us ON s.institution = ub.sector
                                  JOIN branches ub ON us.is = ub.sector
                                  JOIN users u ON u.branch = ub.id
                         WHERE u.id = ${userId} ${searchTerm
            ? sql`AND e.name ILIKE
                                 ${searchTerm}`
            : sql``}`;
    }

    async updateMember(data){
        return await sql`UPDATE members 
                        SET member      = ${data.member},
                            type        = ${data.type},
                            value       = ${data.value},
                            payment     = ${data.payment},
                            date        = ${data.date},
                            branch      = (SELECT id FROM branches WHERE name = ${data.branch})
                        WHERE id = ${data.id}
                        RETURNING id`
    }
    async deleteMember (expenseId) {
        return await sql`DELETE FROM members
                        WHERE id = ${expenseId}`
    }
}