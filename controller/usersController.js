import "dotenv/config";
import bcrypt from "bcrypt"
import {sql} from "../db.js";

export class dataBasePostgresUsers {

    async create_user(user) {

        return await sql`INSERT INTO users (name, email, password) VALUES (${user.name}, ${user.email}, ${user.encryptedPassword}) RETURNING *`
    }


    async login(loginEmail, loginPassword) {
        let user
        try{
            user = await sql`SELECT password FROM users WHERE email ILIKE ${'%' + loginEmail + '%'}`
            if (user[0].password == null) {
                return {
                    success: false,
                    route: "/",
                }
            }

            const isValidPassword = await bcrypt.compare(loginPassword, user[0].password)

            if (isValidPassword) {
                return {
                    success: true,
                    route: "/main",
                }
            }
            return {
                success: false,
                route: "/",
            }
        }catch (error) {
            console.log(error)
        }

    }

    async edit_user(userID, user) {
        const { name, email, password } = user

        await sql`UPDATE users SET  name = ${name}, email = ${email}, password = ${password} WHERE id = ${userID}`
    }

    async delete_user(userID) {
        await sql`DELETE FROM users WHERE id = ${userID}`
    }

}