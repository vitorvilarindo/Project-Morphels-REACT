import {sql} from "../../db.js";
export class SectorsRepository{
    async createSector (sectorData) {
        return await sql`INSERT INTO expenses (name, sectorial_cordenator, vice_sectorial_cordenator, institution)
        VALUES(
               ${sectorData.name},
               ${sectorData.sectorial_cordenator},
               ${sectorData.vice_sectorial_cordenator},
                (SELECT id FROM institution WHERE name = ${sectorData.institution})
              )
        RETURNING id`
    }

    async listSectors(userId) {
        return await sql`SELECT s.*
                         FROM sectors s
                                  JOIN branches b ON s.institution = b.institution
                                  JOIN users u ON b.id = u.branch
                         WHERE u.id = ${userId}`
    }


    async updateSector(data){
        return await sql`UPDATE sectors 
                        SET name                        = ${data.name},
                            sectorial_cordenator        = ${data.sectorial_cordenator},
                            vice_sectorial_cordenator   = ${data.vice_sectorial_cordenator}
                        RETURNING id`
    }
    async deleteSector (expenseId) {
        return await sql`DELETE FROM sectors e
                        WHERE id = ${expenseId}`
    }
}