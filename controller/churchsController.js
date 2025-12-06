import "dotenv/config";
import bcrypt from "bcrypt"
import {sql} from "../db.js";


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