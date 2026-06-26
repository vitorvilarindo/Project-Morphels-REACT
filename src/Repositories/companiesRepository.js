import {sql} from "../../db.js";

export class CompaniesRepository {
    async createCompany (companyData, userId) {
        return await sql`INSERT INTO companies (cnpj, company_name, fantasy_name, estate_registration,
                                              munincipal_registration, open_date, situation, cep, street, number,
                                              complement, neighborhood, city, uf, cellphone, email, cnae,
                                              activity_description, pixkey, pixtype, institution)
                         VALUES (${companyData.cnpj},
                                 ${companyData.company_name},
                                 ${companyData.fantasy_name},
                                 ${companyData.estate_registration},
                                 ${companyData.munincipal_registration},
                                 ${companyData.open_date},
                                 ${companyData.situation},
                                 ${companyData.cep},
                                 ${companyData.street},
                                 ${companyData.number},
                                 ${companyData.complement},
                                 ${companyData.neighborhood},
                                 ${companyData.city},
                                 ${companyData.uf},
                                 ${companyData.cellphone},
                                 ${companyData.email},
                                 ${companyData.cnae},
                                 ${companyData.activity_description},
                                 ${companyData.pixkey},
                                 ${companyData.pixtype}),
                                (SELECT s.institution
                                    FROM users u
                                    JOIN branches b ON u.branch = b.id
                                    JOIN sectors s ON b.sector = s.id
                                    WHERE u.id = ${userId}
                                )
        RETURNING id`
    }

    async listCompanies (userId){
        return await sql`SELECT * FROM companies c
                                JOIN institutions i ON i.id = c.institution
                                JOIN sectors s ON s.institution = i.id
                                JOIN branches b ON b.sector = s.id
                                JOIN users u ON u.branchs = b.id
                                WHERE u.id = ${userId}`
    }

    async updateCompany(data, id){
        return await sql`UPDATE companies 
                        SET cnpj                    = ${data.member},
                            company_name            = ${data.type},
                            fantasy_name            = ${data.value},
                            estate_registration     = ${data.payment},
                            munincipal_registration = ${data.date},
                            open_date               = ${data.open_data} situation = ${data.situation}
                            cep = ${data.cep}
                            street = ${data.street}
                            number = ${data.number}
                            complement = ${data.complement}
                            neighborhood = ${data.neighborhood}
                            city = ${data.city}
                            uf = ${data.uf}
                            cellphone = ${data.cellphone}
                            email = ${data.email}
                            cnae = ${data.cnae}
                            activity_description = ${data.activity_description}
                            pixkey = ${data.pixkey}
                            pixtype = {data.pixtype}
                        WHERE id = ${id}
                        RETURNING id`
    }
    async deleteCompany (companyId) {
        return await sql`DELETE FROM companies
                        WHERE id = ${companyId}`
    }
}