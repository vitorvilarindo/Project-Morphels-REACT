import { sql } from "../db.js"

export async function getPermissionsRolesByID(id) {
    try{
        console.log("OLHA AQUI  :" + id)
        return await sql`SELECT pr.permission_id from users u JOIN permissions_roles pr ON pr.role_id = u.designation WHERE u.id = ${id}`

    }catch(e){
        console.log(e)
    }
}
export async function getPermissionsRolesHandle(req, rep, userID = null) {
    try{
        const id = req.body.id
        console.log("OLHA AQUI  :" + id)
        return rep.status(200).send({permissions: await sql`SELECT pr.permission_id from users u JOIN permissions_roles pr ON pr.role_id = u.designation WHERE u.id = ${id}`})

    }catch(e){
        console.log(e)
        return rep.status(500).send({})
    }

}

export async function createAccessPemissionRole(req, rep) {
    try{
        const {role , permissions} = req.body
        const roleID = await sql`SELECT id FROM roles WHERE name = ${role}`;
        for (let permission of permissions) {
            sql`INSERT INTO permissions_roles (permission_id, role_id) VALUES (${permission}, ${roleID})`;
        }
    }catch(e){
        console.log(e)
    }
}