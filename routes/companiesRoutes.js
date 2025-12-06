import {dataBasePostgresCompanies} from "../controller/companiesController.js"

const database_companies = new dataBasePostgresCompanies()

export default async function companiesRoutes(server, opts){
    server.post('/companies', async (request, reply) => {
        const { CNPJ, company_name, fantasy_name, estate_registration, municipal_registration, open_date, situation, cep, street, number, complement, neighborhood, city, UF, cellphone, email, CNAE, activity_description, pixkey, pixtype } = request.body
        console.log(request.body)
        await database_companies.create_company({
            CNPJ,
            company_name,
            fantasy_name,
            estate_registration,
            municipal_registration,
            open_date,
            situation,
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            UF,
            cellphone,
            email,
            CNAE,
            activity_description,
            pixkey,
            pixtype,
            user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"
        })
        reply.status(201).send()
        console.log("Deu bom")
    })

    server.get('/companies', async (request, reply) => {
        const search = request.query.search
        const companies = await database_companies.list_companies(search)
        return reply.status(200).send(companies)
    })

    server.put('/companies/:id', async (request, reply) => {
        const companyID = request.params.id
        const { CNPJ, company_name, fantasy_name, estate_registration, municipal_registration, open_date, situation, cep, street, number, complement, neighborhood, city, UF, cellphone, email, CNAE, activity_description, pixkey, pixtype, user_id } = request.body
        await database_companies.edit_companies(companyID, {
            CNPJ,
            company_name,
            fantasy_name,
            estate_registration,
            municipal_registration,
            open_date,
            situation,
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            UF,
            cellphone,
            email,
            CNAE,
            activity_description,
            pixkey,
            pixtype,
            user_id
        })
        return reply.status(204).send()
    })

    server.delete('/companies/:id', async (request, reply) => {
        const companyID = request.params.id
        await database_companies.delete_companies(companyID)
        return reply.status(204).send()
    })
}