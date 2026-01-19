import { sql } from "../db.js"
import {getPermissionByName} from "./permissionsController.js";

export async function getData(request, reply)  {
    try {
        let { type_revenues, type_expenses, date1: start_date, date2: end_date } = request.query
        let revenues
        let expenses
        let sum
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

        if (type_revenues === "All") {
            type_revenues = ""
        }
        if (type_expenses === "All") {
            type_expenses = ""
        }

        if (start_date === "") {
            const revenues_date = await sql`SELECT date FROM revenues`
            const timestamps = revenues_date.map(d => new Date(d.date).getTime())
            start_date = new Date(Math.min(...timestamps))

        }

        if (end_date === "") {
            const revenues_date = await sql`SELECT date FROM revenues`
            const timestamps = revenues_date.map(d => new Date(d.date).getTime())
            end_date = new Date(Math.max(...timestamps))
        }

        const user = await sql`SELECT * FROM users WHERE id = ${request.userID}`

        switch (indice) {
            case 0:
                revenues = await sql`SELECT r.*
                    FROM revenues r
                                     JOIN users u ON r.church = u.church
                                     WHERE u.id = ${request.userID} AND r.type ILIKE '%' || ${type_revenues} || '%'
                                       AND r.date BETWEEN ${start_date} :: date AND ${end_date}::date`
                expenses = await sql`SELECT e.*
                                     FROM expenses e
                                     JOIN users u ON e.church = u.church
                                     WHERE u.id = ${request.userID} AND e.type ILIKE '%' || ${type_expenses} || '%'
                                       AND e.date BETWEEN ${start_date}::date AND ${end_date}::date`

                sum = await sql`WITH user_church AS (
                    SELECT church
                    FROM users 
                    WHERE id = ${request.userID}
                    )
                    SELECT
                        (SELECT SUM(r.value)
                         FROM revenues r, user_church uc 
                         WHERE r.church = uc.church
                            AND r.type = ${type_revenues}
                           AND r.date BETWEEN ${start_date}::date 
                               AND ${end_date}::date ) AS revenues_sum,
                        (SELECT SUM(e.value)
                        FROM expenses e, user_church uc
                        WHERE e.church = uc.church
                        AND e.type = ${type_revenues}
                           AND e.date BETWEEN ${start_date}::date 
                               AND ${end_date}::date ) AS expenses_sum;
                        `

                break
            case 1:
                revenues = await sql`
                    SELECT r.*
                    FROM churchs c
                             JOIN revenues r ON r.church = c.id
                             JOIN users u ON c.sector = u.sector
                    WHERE u.id = ${request.userID}
                      AND r.type ILIKE '%' || ${type_revenues} || '%'
                      AND r.date BETWEEN ${start_date}::date AND ${end_date}::date
                `
                expenses = await sql`
                    SELECT e.*
                    FROM churchs c
                             JOIN expenses e ON e.church = c.id
                             JOIN users u ON c.sector = u.sector
                    WHERE u.id = ${request.userID}
                      AND e.type ILIKE '%' || ${type_expenses} || '%'
                      AND e.date BETWEEN ${start_date}::date AND ${end_date}::date
                `
                sum = await sql`
                    SELECT
                        (SELECT SUM(r.value)
                         FROM churchs c 
                         JOIN revenues r ON r.church = c.id
                         JOIN users u ON c.sector = u.sector
                         WHERE u.id = ${request.userID}
                            AND r.type = ${type_revenues}
                           AND r.date BETWEEN ${start_date}::date 
                               AND ${end_date}::date ) AS revenues_sum,
                        (SELECT SUM(e.value)
                        FROM churchs c
                        JOIN expenses e ON e.church = c.id
                        JOIN users u ON c.sector = u.sector
                        AND e.type = ${type_revenues}
                           AND e.date BETWEEN ${start_date}::date 
                               AND ${end_date}::date ) AS expenses_sum;`
                break
            case 2:
                revenues = await sql`SELECT r.*
                                     FROM churchs c
                                              JOIN revenues r ON r.church = c.id
                                              JOIN users u ON c.id = u.church
                                     WHERE u.id = ${request.userID}
                                       AND r.type ILIKE '%' || ${type_revenues} || '%'
                                       AND r.date BETWEEN ${start_date}::date AND ${end_date}::date`

                expenses = await sql`SELECT e.*
                                     FROM churchs c
                                              JOIN expenses e ON e.church = c.id
                                              JOIN users u ON c.id = u.church
                                     WHERE u.id = ${request.userID}
                                       AND e.type ILIKE '%' || ${type_expenses} || '%'
                                       AND e.date BETWEEN ${start_date}::date AND ${end_date}::date`
                sum = await sql`
                    SELECT
                        (SELECT SUM(r.value)
                         FROM churchs c 
                         JOIN revenues r ON r.church = c.id
                         JOIN users u ON c.id = u.church
                         WHERE u.id = ${request.userID}
                            AND r.type = ${type_revenues}
                           AND r.date BETWEEN ${start_date}::date 
                               AND ${end_date}::date ) AS revenues_sum,
                        (SELECT SUM(e.value)
                        FROM churchs c
                        JOIN expenses e ON e.church = c.id
                        JOIN users u ON c.id = u.church 
                        AND e.type = ${type_revenues}
                           AND e.date BETWEEN ${start_date}::date 
                               AND ${end_date}::date ) AS expenses_sum;`

        }
        return reply.status(200).send({"revenues":revenues,
        "expenses":expenses,
        "info_user": user})
    } catch (error) {
        console.error("Erro ao listar receitas:", error)
        return reply.status(500).send({ error: "Erro ao listar receitas" })
    }
}