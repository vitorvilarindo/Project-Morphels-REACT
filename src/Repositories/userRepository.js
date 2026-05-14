import {sql} from "../../db.js";

export class UserRepository {
    async findUserByEmail(email) {
        const [user] = await sql`SELECT *
                                 FROM users
                                 WHERE email = ${email}`;
        return user;
    }

    async createUser(userData) {
        return await sql`INSERT INTO users (name, email, password, phone_number, designation, sector, branch,
                                            last_access, sing_up_date)
        VALUES (
            ${userData.name}, 
            ${userData.email}, 
            ${userData.password}, 
            ${userData.phone_number},
            (SELECT id FROM roles WHERE name = ${userData.designation}),
            (SELECT id FROM sectors WHERE name = ${userData.sector}),
            (SELECT id FROM branches WHERE name = ${userData.branch}),
            NOW(), 
            NOW())
        RETURNING id;
        `;
    }

    async listAllWithRoles() {
        return await sql`SELECT u.name, u.email, r.name as designation_name, u.last_access, u.sing_up_date
                         FROM users u
                                  LEFT JOIN roles r ON u.designation = r.id
        `;
    }

    async updateLastAccess(email) {
        await sql`UPDATE users
                  SET last_access = ${new Date()}
                  WHERE email = ${email};`
    }

    async updateUser(data) {
        return await sql`UPDATE users
                         SET name         = ${data.name},
                             email        = ${data.email},
                             password     = ${data.password},
                             phone_number = ${data.phone_number},
                             branch       = ${data.branch},
                             sector       = ${data.sector};
                        RETURNING id;`
    }

    async deleteUser(id) {
        return await sql`DELETE FROM users`
    }
}