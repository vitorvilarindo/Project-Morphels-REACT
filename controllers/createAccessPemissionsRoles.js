import { sql } from "../db.js"

export class createAccessPemissionsRoles{
    async verifyPermisionRoles(id){
        return await sql`SELECT pr.permission_id from users u JOIN permissions_roles pr ON pr.role_id = u.designation WHERE u.id = ${id}`
    }
}