import {sql} from "../../db.js";

export class CompaniesRepository {
    async createCompany (companyData) {
        return await sql`INSERT INTO companies (cnpj, company_name, fantasy_name, estate_registration,
                                              munincipal_registration, open_date, situation, cep, street, number,
                                              complement, neighborhood, city, uf, cellphone, email, cnae,
                                              activity_description, pixkey, pixtype)
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
                                 ${companyData.pixtype})
        RETURNING id`
    }

    async listCompanies (){
        return await sql`SELECT * FROM companies `
    }

    async updateCompany(data){
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
                        WHERE id = ${data.id}
                        RETURNING id`
    }
    async deleteCompany (companyId) {
        return await sql`DELETE FROM companies
                        WHERE id = ${companyId}`
    }
}