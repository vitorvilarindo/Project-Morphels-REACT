import { sql } from "../db.js"
import {getPermissionByName} from "./permissionsController.js";

export async function localReportsData(request, reply)  {
    try {
        let { id } = request.body
        let revenues ={}
        let expenses = {}
        let sum = {}
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
        const params = await sql`SELECT date, start_date, end_date, by, church, sector, items from reports where id = ${id}`;

        const start_date = params[0].start_date
        const end_date = params[0].end_date

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
                if (params[0].items.revenues === true){
                    revenues = await sql`SELECT r.*
                    FROM revenues r
                                     JOIN users u ON r.church = u.church
                                     WHERE u.id = ${request.userID}
                                       AND r.date BETWEEN ${start_date} :: date AND ${end_date}::date`
                }
                if (params[0].items.expenses === true) {
                    expenses = await sql`SELECT e.*
                                     FROM expenses e
                                     JOIN users u ON e.church = u.church
                                     WHERE u.id = ${request.userID}
                                       AND e.date BETWEEN ${start_date}::date AND ${end_date}::date`
                }

                if (params[0].items.resume === true) {
                    sum = await sql`
                        WITH user_data AS (
                            SELECT church FROM users WHERE id = ${request.userID}
                        ),
                             total_revenues AS (
                                 SELECT SUM(r.value) as total
                                 FROM revenues r, user_data ud
                                 WHERE r.church = ud.church
                                   AND r.date BETWEEN ${start_date}::date AND ${end_date}::date
                             ),
                             total_expenses AS (
                                 SELECT SUM(e.value) as total
                                 FROM expenses e, user_data ud
                                 WHERE e.church = ud.church
                                   AND e.date BETWEEN ${start_date}::date AND ${end_date}::date
                             )
                        SELECT
                            COALESCE((SELECT total FROM total_revenues), 0) AS revenues_sum,
                            COALESCE((SELECT total FROM total_expenses), 0) AS expenses_sum
                    `;
                }

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
        return reply.status(200).send({
            "revenues":revenues,
        "expenses":expenses,
        "information": information,
        "date": params[0].date,
        "sum": sum})
    } catch (error) {
        console.error("Erro ao listar receitas:", error)
        return reply.status(500).send({ error: "Erro ao listar receitas" })
    }
}

export async function setReportPreset(request, reply) {
    try {
        // 'options' aqui já é o objeto { resume: bool, revenues: bool... }
        let { title, type, start_date, end_date, church, options } = request.body;

        const by = await sql`SELECT r.name from users u join roles r on r.id = u.designation where u.id = ${request.userID}`;

        let sector;
        const date = new Date(); // O driver postgres.js aceita o objeto Date diretamente

        if (!church) {
            const result = await sql`
                select u.church, u.sector
                from users u
                where u.id = ${request.userID}
            `;
            church = result[0]?.church;
            sector = result[0]?.sector;
        } else {
            // CORREÇÃO: Remova as aspas simples e a interpolação manual para evitar SQL Injection
            const sectorResult = await sql`SELECT c.sector from churchs c where c.name = ${church}`;
            sector = sectorResult[0]?.sector;
        }

        const newReportPreset = await sql`
            INSERT INTO reports (title, type, date, start_date, end_date, by, sector, church, items)
            VALUES (
                       ${title},
                       ${type},
                       ${date},
                       ${start_date},
                       ${end_date},
                       ${by[0].name},
                       ${sector},
                       ${church},
                       ${options} -- O driver detecta que é um objeto e grava como JSONB
                   )
            RETURNING *
        `;

        return reply.status(201).send(newReportPreset[0]);
    } catch (error) {
        console.error("Erro ao criar relatório:", error);
        return reply.status(500).send({ error: "Erro ao criar relatório" });
    }
}
export async function listReports(request, reply) {
    try {
        const { search } = request.query
        const reports = await sql`SELECT *
                                FROM reports`
        return reply.status(200).send(reports)
    }catch(error) {
    console.error("Erro ao listar reports:", error)
    }
}
