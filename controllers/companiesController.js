import { sql } from "../db.js"

// Criar empresa
export async function createCompany(request, reply) {
    try {
        const company = request.body
        const newCompany = await sql`
      INSERT INTO companies (
        CNPJ, company_name, fantasy_name, estate_registration, municipal_registration,
        open_date, situation, cep, street, number, complement, neighborhood, city, UF,
        cellphone, email, CNAE, activity_description, pixkey, pixtype
      )
      VALUES (
        ${company.CNPJ}, ${company.company_name}, ${company.fantasy_name}, ${company.estate_registration},
        ${company.municipal_registration}, ${company.open_date}, ${company.situation}, ${company.cep},
        ${company.street}, ${company.number}, ${company.complement}, ${company.neighborhood},
        ${company.city}, ${company.UF}, ${company.cellphone}, ${company.email}, ${company.CNAE},
        ${company.activity_description}, ${company.pixkey}, ${company.pixtype}
      )
      RETURNING *
    `
        return reply.status(201).send(newCompany[0])
    } catch (error) {
        console.error("Erro ao inserir empresa:", error)
        return reply.status(500).send({ error: "Erro ao criar empresa" })
    }
}

// Listar empresas (com busca opcional)
export async function listCompanies(request, reply) {
    try {
        const { search } = request.query
        let companies

        if (search) {
            companies = await sql`
        SELECT * FROM companies
        WHERE company_name ILIKE '%' || ${search} || '%'
           OR fantasy_name ILIKE '%' || ${search} || '%'
           OR cnpj ILIKE '%' || ${search} || '%'
           OR estate_registration ILIKE '%' || ${search} || '%'
           OR municipal_registration ILIKE '%' || ${search} || '%'
           OR cnae ILIKE '%' || ${search} || '%'
           OR activity_description ILIKE '%' || ${search} || '%'
           OR pixkey ILIKE '%' || ${search} || '%'
      `
        } else {
            companies = await sql`SELECT * FROM companies`
        }

        return reply.status(200).send(companies)
    } catch (error) {
        console.error("Erro ao listar empresas:", error)
        return reply.status(500).send({ error: "Erro ao listar empresas" })
    }
}

// Editar empresa
export async function editCompany(request, reply) {
    try {
        const { id } = request.params
        const {
            CNPJ, company_name, fantasy_name, estate_registration, municipal_registration,
            open_date, situation, cep, street, number, complement, neighborhood, city, UF,
            cellphone, email, CNAE, activity_description, pixkey, pixtype
        } = request.body

        const updated = await sql`
      UPDATE companies
      SET CNPJ = ${CNPJ}, company_name = ${company_name}, fantasy_name = ${fantasy_name},
          estate_registration = ${estate_registration}, municipal_registration = ${municipal_registration},
          open_date = ${open_date}, situation = ${situation}, cep = ${cep}, street = ${street},
          number = ${number}, complement = ${complement}, neighborhood = ${neighborhood},
          city = ${city}, UF = ${UF}, cellphone = ${cellphone}, email = ${email}, CNAE = ${CNAE},
          activity_description = ${activity_description}, pixkey = ${pixkey}, pixtype = ${pixtype}
      WHERE id = ${id}
      RETURNING *
    `
        if (updated.length === 0) {
            return reply.status(404).send({ error: "Empresa não encontrada" })
        }
        return reply.send(updated[0])
    } catch (error) {
        console.error("Erro ao atualizar empresa:", error)
        return reply.status(500).send({ error: "Erro ao atualizar empresa" })
    }
}

// Deletar empresa
export async function deleteCompany(request, reply) {
    try {
        const { id } = request.params
        const deleted = await sql`DELETE FROM companies WHERE id = ${id} RETURNING *`

        if (deleted.length === 0) {
            return reply.status(404).send({ error: "Empresa não encontrada" })
        }
        return reply.send({ message: "Empresa removida com sucesso" })
    } catch (error) {
        console.error("Erro ao remover empresa:", error)
        return reply.status(500).send({ error: "Erro ao remover empresa" })
    }
}
