import {sql} from "../../db.js";

export class UserRepository {
    async findUserByEmail(email) {
        const [user] = await sql`SELECT *
                                 FROM users
                                 WHERE email = ${email}`;
        return user;
    }

    async createUser(userData) {
        return await sql`INSERT INTO users (name, email, password, sing_up_date designation, sector, branch,
                                            last_access, sing_up_date)
        SELECT 
            ${userData.name}, 
            ${userData.email}, 
            ${userData.password}, 
            ${userData.phone_number},
            (SELECT id FROM roles WHERE name = ${userData.designation}),
            (SELECT id FROM sectors WHERE sector = ${userData.sector}),
            (SELECT id FROM churchs WHERE name = ${userData.church}),
            NOW(), 
            NOW()
        RETURNING id;
        `;
    }

    async listAllWithRoles() {
        return await sql`SELECT u.name, u.email, r.name as designation_name, u.last_access, u.sing_up_date
                         FROM users u
                                  LEFT JOIN roles r ON u.designation = r.id
        `;
    }

    async updateLastAccess(id) {
        await sql`UPDATE users
                  SET last_access = ${new Date()}
                  WHERE id = ${id};`
    }
}