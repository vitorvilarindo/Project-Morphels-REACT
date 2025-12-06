import "dotenv/config";
import bcrypt from "bcrypt"
import {sql} from "../db.js";

export class dataBasePostgresCompanies {
    async create_company(company) {
        try {
            return await sql`INSERT INTO companies (
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
    pixtype 
    ) VALUES (
    ${company.CNPJ}, 
    ${company.company_name}, 
    ${company.fantasy_name}, 
    ${company.estate_registration}, 
    ${company.municipal_registration}, 
    ${company.open_date}, 
    ${company.situation}, 
    ${company.cep}, 
    ${company.street}, 
    ${company.number}, 
    ${company.complement}, 
    ${company.neighborhood}, 
    ${company.city}, 
    ${company.UF}, 
    ${company.cellphone}, 
    ${company.email}, 
    ${company.CNAE}, 
    ${company.activity_description}, 
    ${company.pixkey}, 
    ${company.pixtype}
    ) RETURNING *`
        }
        catch (error) {
            console.error("Error inserting company:", error);
            throw error; // rethrow so caller can handle
        }
    }


    async list_companies(search) {
        let companies
        try {
            if (search) {
                companies = await sql`SELECT *
                              FROM companies
                              WHERE company_name ILIKE '%' || ${search} || '%'
                                OR fantasy_name ILIKE '%' || ${search} || '%'
                                OR cnpj ILIKE '%' || ${search} || '%'
                                OR estate_registration ILIKE '%' || ${search} || '%'
                                OR municipal_registration ILIKE '%' || ${search} || '%'
                                OR cnae ILIKE '%' || ${search} || '%'
                                OR activity_description ILIKE '%' || ${search} || '%'
                                OR pixkey ILIKE '%' || ${search} || '%' ;
        `
            } else {
                companies = await sql`SELECT * FROM companies`
            }
            return companies
        }
        catch (error) {
            console.error("Error listing companies:", error);
            throw error; // rethrow so caller can handle
        }
    }


    async edit_companies(companyID, company) {
        const { CNPJ, company_name, fantasy_name, estate_registration, municipal_registration, open_date, situation, cep, street, number, complement, neighborhood, city, UF, cellphone, email, CNAE, activity_description, pixkey, pixtype,  } = company

        try {await sql`UPDATE companies SET  CNPJ = ${CNPJ}, company_name = ${company_name}, fantasy_name = ${fantasy_name}, estate_registration = ${estate_registration}, municipal_registration = ${municipal_registration}, open_date = ${open_date}, situation = ${situation}, cep = ${cep}, street = ${street}, number = ${number}, complement = ${complement}, neighborhood = ${neighborhood}, city = ${city}, UF = ${UF}, cellphone = ${cellphone}, email = ${email}, CNAE = ${CNAE}, activity_description = ${activity_description}, pixkey = ${pixkey}, pixtype = ${pixtype} WHERE id = ${companyID}`}
        catch (error) {
            console.error("Error updating company:", error);
            throw error; // rethrow so caller can handle
        }
    }
    async delete_companies(companyID) {
        try {
            await sql`DELETE FROM companies WHERE id = ${companyID}`
        }
        catch (error) {
            console.error("Error deleting company:", error);
            throw error; // rethrow so caller can handle
        }
    }
}