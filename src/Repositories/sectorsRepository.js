import {sql} from "../../db.js";
export class SectorsRepository{
    async createSector (sectorData, userId) {
        return await sql`INSERT INTO expenses (name, sectorial_cordenator, vice_sectorial_cordenator, institution)
        VALUES(
               ${sectorData.name},
               ${sectorData.sectorial_cordenator},
               ${sectorData.vice_sectorial_cordenator},
               (SELECT s.institution
                FROM users u
                         JOIN branches b ON u.branch = b.id
                         JOIN sectors s ON b.sector = s.id
                WHERE u.id = ${userId}
               )
              )
        RETURNING id`
    }

    async findSectorById(sectorId) {
        const [sector] = await sql`SELECT *
                                   FROM sectors
                                   WHERE sectorId = ${sectorId}`
        return sector;
    }

    async listSectors(userId) {
        return await sql`SELECT s.*
                         FROM sectors s
                                  JOIN branches b ON s.institution = b.institution
                                  JOIN users u ON b.id = u.branch
                         WHERE u.id = ${userId}`
    }


    async updateSector(data, id){
        return await sql`UPDATE sectors 
                        SET name                        = ${data.name},
                            sectorial_cordenator        = ${data.sectorial_cordenator},
                            vice_sectorial_cordenator   = ${data.vice_sectorial_cordenator}
                        where id = ${id}
                        RETURNING id`
    }
    async deleteSector (expenseId) {
        return await sql`DELETE FROM sectors e
                        WHERE id = ${expenseId}`
    }
}