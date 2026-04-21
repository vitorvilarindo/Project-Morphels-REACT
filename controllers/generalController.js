import { sql } from "../db.js"

export async function SumRevenues(request, reply){
    try{
        let sumrevenues
        let sumexpenses
        let indice
        const viewPermissions = ["general_preview", "sectorial_preview", "local_preview"];
        for (let i = 0; i < viewPermissions.length; i++) {
            const permissions = await getPermissionByName(viewPermissions[i]);
            console.log(permissions)
            if (permissions.length > 0 && request.permissions.includes(permissions[0].id)) {
                indice = i; // posição dentro de viewPermissions
                console.log("Permissão encontrada:", permissions[0].id);
                break
            }
        }

        switch (indice) {
            case 0:
                sumrevenues = await sql`
                SELECT SUM(r.value) AS revenues_values FROM revenues r JOIN users u ON r.church = u.church WHERE u.id = ${request.userID}`
                sumexpenses = await sql`SELECT SUM(c.value) AS expenses_values FROM expenses c JOIN users u ON c.church = u.church WHERE u.id = ${request.userID}`

                break
            case 1:
                sumrevenues = await sql`
                    SELECT SUM(r.value) AS revenues_values
                    FROM churchs c
                             JOIN revenues r ON r.church = c.id
                             JOIN users u ON c.sector = u.sector
                    WHERE u.id = ${request.userID}
                `
                sumexpenses = await sql` 
                    SELECT SUM(e.value) AS expenses_values FROM churchs c JOIN expenses e ON e.church = c.id JOIN users u ON c.sector = u.sector WHERE u.id = ${request.userID} 
                    `

                break
            case 2:
                sumrevenues = await sql`SELECT SUM(r.value) AS revenues_values FROM churchs c JOIN revenues r ON r.church = c.id JOIN users u ON c.id = u.church WHERE u.id = ${request.userID}`
                sumrevenues = await sql`SELECT SUM(r.value) AS revenues_values FROM churchs c JOIN revenues r ON r.church = c.id JOIN users u ON c.id = u.church WHERE u.id = ${request.userID}`
        }
        console.log(sumrevenues)
        console.log(sumexpenses)

        return reply.status(200).send({
                "revenues": sumrevenues[0].revenues_values,
                "expenses": sumexpenses[0].expenses_values})
    } catch (error) {
        console.error("Erro ao listar receitas:", error)
        return reply.status(500).send({ error: "Erro ao listar receitas" })
    }
}
export async function getPermissions(request, reply){
    return reply.status(200).send({
        permissions: request.permissions
    })
}