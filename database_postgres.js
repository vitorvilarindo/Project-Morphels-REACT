import { randomUUID } from "node:crypto";
import { sql} from "./db.js";
import * as sea from "node:sea";

export class dataBasePostgresUsers {

  async create_user(user) {
    
    const users = await sql`INSERT INTO users (name, email, password) VALUES (${user.name}, ${user.email}, ${user.password}) RETURNING *`
    return users
  }
    

  async login(loginEmail, loginPassword) {
    let user
      try{
          user = await sql`SELECT password FROM users WHERE email ILIKE ${'%' + loginEmail + '%'}`
          console.log(user[0].password)
          if (user[0].password == null) {
              return {
                  success: false,
                  route: "/",
              }
          } else if (user[0].password === loginPassword) {
              console.log(user[0].password === loginPassword)
              return {
                  success: true,
                  route: "/main",
              }
          }
      }catch (error) {
        console.log(error)
      }

  }

  async edit_user(userID, user) {
    const { name, email, password } = user

    await sql`UPDATE users SET  name = ${name}, email = ${email}, password = ${password} WHERE id = ${userID}`
  }

  async delete_user(userID) {
    await sql`DELETE FROM users WHERE id = ${userID}`
  }

}

class dataBasePostgresRevenues {

  async create_revenue(revenue) {
    
    const revenues = await sql`INSERT INTO revenues (member, type, value, payment, date, user_id) VALUES (${revenue.member}, ${revenue.type}, ${revenue.value}, ${revenue.payment}, ${revenue.date}, ${revenue.user_id}) RETURNING *`
    return revenues
  }
  async list_revenues(search) {
    let revenues
    if (search) {
       revenues = await sql`SELECT * FROM revenues WHERE member ILIKE ${'%' + search + '%'  }`
    } else {
      revenues = await sql`SELECT * FROM revenues`
    }

    return revenues

  }

  async list_revenues_date(){
      let revenues
      revenues = await sql`SELECT date FROM revenues`
      return revenues
  }

  async filter_revenues(type, start_date, end_date) {
      try{
          let revenues
          revenues = await sql`SELECT *
                               FROM revenues
                               WHERE type ILIKE '%' || ${type} || '%'
                                 AND date BETWEEN ${start_date}::date AND ${end_date}::date;
          `
          return revenues
      }
      catch (error){
          console.error("Error updating expense:", error);
          throw error; // rethrow so caller can handle
      }
  }

  async edit_revenues(revenueID, revenue) {
    const { member, type, value, payment, date, user_id } = revenue

    await sql`UPDATE revenues SET  member = ${member}, type = ${type}, value = ${value}, payment = ${payment}, date = ${date}, user_id = ${user_id} WHERE id = ${revenueID}`
  }

  async delete_revenues(revenueID) {
      try {
          await sql`DELETE FROM revenues WHERE id = ${revenueID}`
      }catch (error){
          console.error("Error updating revenue:", error);
      }

    
  }
}

export default dataBasePostgresRevenues


//Exprenses
export class dataBasePostgresExpenses {

  async create_expense(expense) { 
    const expenses = await sql`INSERT INTO expenses (title, type, value, payment, date, beneficiary, user_id) VALUES (${expense.title}, ${expense.type}, ${expense.value}, ${expense.payment}, ${expense.date}, ${expense.beneficiary}, ${expense.user_id}) RETURNING *`
    return expenses
  }
  async list_expenses(search) {
    let expenses
    if (search) {
       expenses = await sql`SELECT * FROM expenses WHERE title ILIKE ${'%' + search + '%'  } OR beneficiary ILIKE ${'%' + search + '%'  }`
    } else {
      expenses = await sql`SELECT * FROM expenses`
    }
    return expenses

  }

    async list_expenses_date(){
        let expenses
        expenses = await sql`SELECT date FROM expenses`
        return expenses
    }

    async filter_expenses(type, start_date, end_date) {
        try{
            let expenses
            expenses = await sql`SELECT *
                               FROM expenses
                               WHERE type ILIKE '%' || ${type} || '%'
                                 AND date BETWEEN ${start_date}::date AND ${end_date}::date;
          `
            return expenses
        }
        catch (error){
            console.error("Error updating expense:", error);
            throw error; // rethrow so caller can handle
        }
    }

  async edit_expenses(expenseID, expense) {
    const { title, type, value, payment, date, beneficiary, user_id } = expense
    try{
      await sql`UPDATE expenses SET  title = ${title}, type = ${type}, value = ${value}, payment = ${payment}, date = ${date}, beneficiary = ${beneficiary}, user_id = ${user_id} WHERE id = ${expenseID}`
    }
    catch (error){
      console.error("Error updating expense:", error);
      throw error; // rethrow so caller can handle
    }
  }
  
  async delete_expenses(expenseID) {
    await sql`DELETE FROM expenses WHERE ID = ${expenseID}`
  }
}

export class dataBasePostgresMembers {

  async create_members(member) {
    try {
    const members = await sql`
      INSERT INTO members (name, cellphone, date_birth, pixkey, pixtype, user_id)
      VALUES (${member.name}, ${member.cellphone}, ${member.date_birth}, ${member.pixkey}, ${member.pixtype}, ${member.user_id})
      RETURNING *;
    `;
    return members; // usually returns an array of rows
    } catch (error) {
      console.error("Error inserting member:", error);
      throw error; // rethrow so caller can handle
    }

  } 

  async list_members(search) {
    let members
    if (search){
      members = await sql `SELECT * FROM members WHERE name ILIKE ${'%'+ search + '%'}`
    } else {
      members = await sql`SELECT * FROM members`
    }
    return members
  }
  async edit_members(memberID, member) {
    const { name, user_id } = member
    await sql`UPDATE members SET name = ${name}, user_id = ${user_id} WHERE id = ${memberID}`
  }
  async delete_members(memberID) {
    await sql`DELETE FROM members WHERE id = ${memberID}`
  }
}

export class dataBasePostgresCompanies {
  async create_company(company) {
    try {const companies = await sql`INSERT INTO companies (
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
    user_id) VALUES (
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
    ${company.pixtype}, 
    ${company.user_id}) RETURNING *`
    return companies
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
    const { CNPJ, company_name, fantasy_name, estate_registration, municipal_registration, open_date, situation, cep, street, number, complement, neighborhood, city, UF, cellphone, email, CNAE, activity_description, pixkey, pixtype, user_id } = company

    try {await sql`UPDATE companies SET  CNPJ = ${CNPJ}, company_name = ${company_name}, fantasy_name = ${fantasy_name}, estate_registration = ${estate_registration}, municipal_registration = ${municipal_registration}, open_date = ${open_date}, situation = ${situation}, cep = ${cep}, street = ${street}, number = ${number}, complement = ${complement}, neighborhood = ${neighborhood}, city = ${city}, UF = ${UF}, cellphone = ${cellphone}, email = ${email}, CNAE = ${CNAE}, activity_description = ${activity_description}, pixkey = ${pixkey}, pixtype = ${pixtype}, user_id = ${user_id} WHERE id = ${companyID}`}
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