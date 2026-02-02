import { sql } from "../db.js"
import {getPermissionByName} from "./permissionsController.js";

export async function localReportsData(request, reply)  {
    try {
        let { type_revenues, type_expenses, start_date, end_date } = request.body
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

        const information = await sql`SELECT
                                          u.name AS user_name,
                                          c.name AS church_name,
                                          s.sector AS sector_name,
                                          p.name AS presidente_name,
                                          coord.name AS coordenator_name,
                                          sh.name AS sherperd_name
                                      FROM users u
                                               LEFT JOIN churchs c ON u.church = c.id
                                               LEFT JOIN sectors s ON u.sector = s.id
                                               LEFT JOIN users p ON p.designation = '93a4805a-c601-41a4-bb10-cbe13e0c459a'
                                               LEFT JOIN users coord ON coord.designation = '22b0b929-81a4-468f-a8b3-8ac790a3ca0e'
                                          AND coord.sector = u.sector
                                               LEFT JOIN users sh ON sh.designation = '8bb35725-172f-48f6-a04d-2cd62a55183d'
                                          AND sh.church = u.church
                                      WHERE u.id = ${request.userID};
        `

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
                        SUM(r.value) AS revenues_sum,
                        SUM(e.value) AS expenses_sum
                    FROM user_church uc
                    LEFT JOIN revenues r
                        ON r.church = uc.church
                        AND r.type ILIKE '%' || ${type_revenues} || '%'
                        AND r.date BETWEEN ${start_date}::date AND ${end_date}::date
                    LEFT JOIN expenses e 
                        ON e.church = uc.church
                        AND e.type ILIKE '%' || ${type_expenses} || '%'
                        AND e.date BETWEEN ${start_date}::date AND ${end_date}::date
                        `

                break
            // case 1:
            //     revenues = await sql`
            //         SELECT r.*
            //         FROM churchs c
            //                  JOIN revenues r ON r.church = c.id
            //                  JOIN users u ON c.sector = u.sector
            //         WHERE u.id = ${request.userID}
            //           AND r.type ILIKE '%' || ${type_revenues} || '%'
            //           AND r.date BETWEEN ${start_date}::date AND ${end_date}::date
            //     `
            //     expenses = await sql`
            //         SELECT e.*
            //         FROM churchs c
            //                  JOIN expenses e ON e.church = c.id
            //                  JOIN users u ON c.sector = u.sector
            //         WHERE u.id = ${request.userID}
            //           AND e.type ILIKE '%' || ${type_expenses} || '%'
            //           AND e.date BETWEEN ${start_date}::date AND ${end_date}::date
            //     `
            //     sum = await sql`
            //         SELECT
            //             (SELECT SUM(r.value)
            //              FROM churchs c
            //              JOIN revenues r ON r.church = c.id
            //              JOIN users u ON c.sector = u.sector
            //              WHERE u.id = ${request.userID}
            //                 AND r.type = ${type_revenues}
            //                AND r.date BETWEEN ${start_date}::date
            //                    AND ${end_date}::date ) AS revenues_sum,
            //             (SELECT SUM(e.value)
            //             FROM churchs c
            //             JOIN expenses e ON e.church = c.id
            //             JOIN users u ON c.sector = u.sector
            //             AND e.type = ${type_revenues}
            //                AND e.date BETWEEN ${start_date}::date
            //                    AND ${end_date}::date ) AS expenses_sum;`
            //     break
            // case 2:
            //     revenues = await sql`SELECT r.*
            //                          FROM churchs c
            //                                   JOIN revenues r ON r.church = c.id
            //                                   JOIN users u ON c.id = u.church
            //                          WHERE u.id = ${request.userID}
            //                            AND r.type ILIKE '%' || ${type_revenues} || '%'
            //                            AND r.date BETWEEN ${start_date}::date AND ${end_date}::date`
            //
            //     expenses = await sql`SELECT e.*
            //                          FROM churchs c
            //                                   JOIN expenses e ON e.church = c.id
            //                                   JOIN users u ON c.id = u.church
            //                          WHERE u.id = ${request.userID}
            //                            AND e.type ILIKE '%' || ${type_expenses} || '%'
            //                            AND e.date BETWEEN ${start_date}::date AND ${end_date}::date`
            //     sum = await sql`
            //         SELECT
            //             (SELECT SUM(r.value)
            //              FROM churchs c
            //              JOIN revenues r ON r.church = c.id
            //              JOIN users u ON c.id = u.church
            //              WHERE u.id = ${request.userID}
            //                 AND r.type = ${type_revenues}
            //                AND r.date BETWEEN ${start_date}::date
            //                    AND ${end_date}::date ) AS revenues_sum,
            //             (SELECT SUM(e.value)
            //             FROM churchs c
            //             JOIN expenses e ON e.church = c.id
            //             JOIN users u ON c.id = u.church
            //             AND e.type = ${type_revenues}
            //                AND e.date BETWEEN ${start_date}::date
            //                    AND ${end_date}::date ) AS expenses_sum;`

        }
        console.log(sum)
        return reply.status(200).send({"revenues":revenues,
        "expenses":expenses,
        "information": information,
        "sum": sum})
    } catch (error) {
        console.error("Erro ao listar receitas:", error)
        return reply.status(500).send({ error: "Erro ao listar receitas" })
    }
}

export async function setReportPreset(request, reply) {
    try {
        const { title, type, date, start_date, end_date, by, sector, church, items } = request.body
        const newReportPreset = await sql`
      INSERT INTO reports (title, type, date, start_date, end_date, by, sector, church, items)
      VALUES (${title}, ${type}, ${date}, ${start_date}, ${date}, ${end_date}, ${by}, ${sector}, ${church}, ${items})
      RETURNING *
    `
        return reply.status(201).send(newReportPreset[0])
    } catch (error) {
        console.error("Erro ao criar despesa:", error)
        return reply.status(500).send({ error: "Erro ao criar despesa" })
    }
}
export async function listReports(request, reply) {
    try {
        let reports = await sql`SELECT *
                                FROM reports`
        return reply.status(200).send(reports)
    }catch(error) {
    console.error("Erro ao listar reports:", error)
    }
}
