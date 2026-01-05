import { sql } from "../db.js"

export async function getPermissionsRolesByID(id) {
    try{
        return await sql`SELECT pr.permission_id from users u JOIN permissions_roles pr ON pr.role_id = u.designation WHERE u.id = ${id}`

    }catch(e){
        console.log(e)
    }
}
export async function getPermissionsRolesHandle(req, rep, userID = null) {
    try{
        const id = req.body.id
        return rep.status(200).send({permissions: await sql`SELECT pr.permission_id from users u JOIN permissions_roles pr ON pr.role_id = u.designation WHERE u.id = ${id}`})

    }catch(e){
        console.log(e)
        return rep.status(500).send({})
    }

}

export async function createAccessPermissionRole(req, rep) {
    try{
        let permissions_list = []
        const {role , permissions} = req.body
        const roleID = await sql`SELECT id FROM roles WHERE name = ${role}`;
        console.log(roleID[0].id)
        const permissions_exists = await sql`SELECT pr.permission_id FROM permissions_roles pr WHERE pr.role_id = ${roleID[0].id};`;
        for (let i = 0; i < permissions_exists.length; i++) {
            permissions_list = permissions_list.concat(permissions_exists[i].permission_id);
        }

        console.log(permissions_list)

        for (let permission of permissions) {

            const permissionID = await sql`SELECT id FROM permissions WHERE name = ${permission}`;
            console.log(permissionID[0].id)
            if (!permissions_list.includes(permissionID[0].id)){
                await sql`INSERT INTO permissions_roles (permission_id, role_id) VALUES (${permissionID[0].id}, ${roleID[0].id})`;
            }

        }
        return rep.status(200).send({message: "Deu bom"})
    }catch(e){
        console.log(e)
        return rep.status(500).send({message: "Deu ruim"})
    }
}