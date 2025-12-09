import "dotenv/config";
import bcrypt from "bcrypt"
import {sql} from "../db.js";


export class dataBasePostgresMembers {

    async create_members(member) {
        try {
            return await sql`
      INSERT INTO members (name, cellphone, date_birth, pixkey, pixtype)
      VALUES (${member.name}, ${member.cellphone}, ${member.date_birth}, ${member.pixkey}, ${member.pixtype})
      RETURNING *;
    `; // usually returns an array of rows
        } catch (error) {
            console.error("Error inserting member:", error);
            throw error; // rethrow so caller can handle
        }

    }

    async list_members(search) {
        let members
        if (search){
            members = await sql `SELECT * FROM members WHERE name ILIKE ${'%'+ search + '%'}`
        } else {
            members = await sql`SELECT * FROM members`
        }
        return members
    }
    async edit_members(memberID, member) {
        const { name,  } = member
        await sql`UPDATE members SET name = ${name} WHERE id = ${memberID}`
    }
    async delete_members(memberID) {
        await sql`DELETE FROM members WHERE id = ${memberID}`
    }
}