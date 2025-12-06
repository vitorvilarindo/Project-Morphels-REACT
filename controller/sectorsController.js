import "dotenv/config";
import bcrypt from "bcrypt"
import {sql} from "../db.js";

export class dataBasePostgresSectors {
    async create_sector(sector){
        return await sql`INSERT INTO sectors ( sector, sectorial_cordenator, vice_sectorial_cordenator) VALUES (${sector.sector}, ${sector.sectorial_cordenator}, ${sector.vice_sectorial_cordenator}) RETURNING *`
    }

    async list_sector (search){

        if (search) {
            return await sql`SELECT * FROM sectors WHERE sector = ${search}`
        }
        return await sql`SELECT * FROM sectors`

    }

    async edit_sector (sector, sectorID){
        const {sector, sectorial_cordenator, vice_sectorial_cordenator} = sector
        await sql`UPDATE sectors SET sector = ${sector}, sectorial_cordenator = ${sectorial_cordenator}, vice_sectorial_cordenator = ${vice_sectorial_cordenator} WHERE id = ${sectorID}`
    }

    async delete_sector (sectorID) {
        await sql`DELETE FROM sectors WHERE id = ${sectorID}`
    }
}

export class dataBasePostgresChurchs {
    async create_church(church){
        return await sql`INSERT INTO churchs (name, sector, shepherd) VALUES (${church.name}, ${church.sector}, ${church.shepherd}) RETURNING *`
    }

    async list_church (search){

        if (search) {
            return await sql`SELECT * FROM churchs WHERE name = ${search}`
        }
        return await sql`SELECT * FROM churchs`

    }

    async edit_church (church, churchID){
        const {name, sector, shepherd} = church
        await sql`UPDATE churchs SET name = ${name}, sector = ${sector}, shepherd = ${shepherd} WHERE id = ${churchID}`
    }

    async delete_church (churchID) {
        await sql`DELETE FROM churchs WHERE id = ${churchID}`
    }
}