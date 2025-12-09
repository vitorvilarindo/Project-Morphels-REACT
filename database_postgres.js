// import "dotenv/config";
// import bcrypt from "bcrypt"
// import {sql} from "./db.js";
//
// export class dataBasePostgresUsers {
//
//   async create_user(user) {
//
//   return await sql`INSERT INTO users (name, email, password) VALUES (${user.name}, ${user.email}, ${user.encryptedPassword}) RETURNING *`
//   }
//
//
//   async login(loginEmail, loginPassword) {
//     let user
//       try{
//           user = await sql`SELECT password FROM users WHERE email ILIKE ${'%' + loginEmail + '%'}`
//           if (user[0].password == null) {
//               return {
//                   success: false,
//                   route: "/",
//               }
//           }
//
//           const isValidPassword = await bcrypt.compare(loginPassword, user[0].password)
//
//           if (isValidPassword) {
//               return {
//                   success: true,
//                   route: "/main",
//               }
//           }
//           return {
//               success: false,
//               route: "/",
//           }
//       }catch (error) {
//         console.log(error)
//       }
//
//   }
//
//   async edit_user(userID, user) {
//     const { name, email, password } = user
//
//     await sql`UPDATE users SET  name = ${name}, email = ${email}, password = ${password} WHERE id = ${userID}`
//   }
//
//   async delete_user(userID) {
//     await sql`DELETE FROM users WHERE id = ${userID}`
//   }
//
// }
//
// export class dataBasePostgresSectors {
//     async create_sector(sector){
//         return await sql`INSERT INTO sectors ( sector, sectorial_cordenator, vice_sectorial_cordenator) VALUES (${sector.sector}, ${sector.sectorial_cordenator}, ${sector.vice_sectorial_cordenator}) RETURNING *`
//     }
//
//     async list_sector (search){
//
//         if (search) {
//             return await sql`SELECT * FROM sectors WHERE sector = ${search}`
//         }
//         return await sql`SELECT * FROM sectors`
//
//     }
//
//     async edit_sector (sectorI, sectorID){
//         const {sector, sectorial_cordenator, vice_sectorial_cordenator} = sectorI
//         await sql`UPDATE sectors SET sector = ${sector}, sectorial_cordenator = ${sectorial_cordenator}, vice_sectorial_cordenator = ${vice_sectorial_cordenator} WHERE id = ${sectorID}`
//     }
//
//     async delete_sector (sectorID) {
//         await sql`DELETE FROM sectors WHERE id = ${sectorID}`
//     }
// }
//
// export class dataBasePostgresChurchs {
//     async create_church(church){
//         return await sql`INSERT INTO churchs (name, sector, shepherd) VALUES (${church.name}, ${church.sector}, ${church.shepherd}) RETURNING *`
//     }
//
//     async list_church (search){
//
//         if (search) {
//             return await sql`SELECT * FROM churchs WHERE name = ${search}`
//         }
//         return await sql`SELECT * FROM churchs`
//
//     }
//
//     async edit_church (church, churchID){
//         const {name, sector, shepherd} = church
//         await sql`UPDATE churchs SET name = ${name}, sector = ${sector}, shepherd = ${shepherd} WHERE id = ${churchID}`
//     }
//
//     async delete_church (churchID) {
//         await sql`DELETE FROM churchs WHERE id = ${churchID}`
//     }
// }
//
// export class dataBasePostgresRevenues {
//
//   async create_revenue(revenue) {
//
//   return await sql`INSERT INTO revenues (member, type, value, payment, date ) VALUES (${revenue.member}, ${revenue.type}, ${revenue.value}, ${revenue.payment}, ${revenue.date}) RETURNING *`
//   }
//   async list_revenues(search) {
//     let revenues
//     if (search) {
//        revenues = await sql`SELECT * FROM revenues WHERE member ILIKE ${'%' + search + '%'  }`
//     } else {
//       revenues = await sql`SELECT * FROM revenues`
//     }
//
//     return revenues
//
//   }
//
//   async list_revenues_date(){
//       let revenues
//       revenues = await sql`SELECT date FROM revenues`
//       return revenues
//   }
//
//   async filter_revenues(type, start_date, end_date) {
//       try{
//           let revenues
//           revenues = await sql`SELECT *
//                                FROM revenues
//                                WHERE type ILIKE '%' || ${type} || '%'
//                                  AND date BETWEEN ${start_date}::date AND ${end_date}::date;
//           `
//           return revenues
//       }
//       catch (error){
//           console.error("Error updating expense:", error);
//           throw error; // rethrow so caller can handle
//       }
//   }
//
//   async edit_revenues(revenueID, revenue) {
//     const { member, type, value, payment, date,  } = revenue
//
//     await sql`UPDATE revenues SET  member = ${member}, type = ${type}, value = ${value}, payment = ${payment}, date = ${date} WHERE id = ${revenueID}`
//   }
//
//   async delete_revenues(revenueID) {
//       try {
//           await sql`DELETE FROM revenues WHERE id = ${revenueID}`
//       }catch (error){
//           console.error("Error updating revenue:", error);
//       }
//
//
//   }
// }
//
//
//
// //Exprenses
// export class dataBasePostgresExpenses {
//
//   async create_expense(expense) {
//
//     return await sql`INSERT INTO expenses (title, type, value, payment, date, beneficiary ) VALUES (${expense.title}, ${expense.type}, ${expense.value}, ${expense.payment}, ${expense.date}, ${expense.beneficiary}) RETURNING *`
//   }
//   async list_expenses(search) {
//     let expenses
//     if (search) {
//        expenses = await sql`SELECT * FROM expenses WHERE title ILIKE ${'%' + search + '%'  } OR beneficiary ILIKE ${'%' + search + '%'  }`
//     } else {
//       expenses = await sql`SELECT * FROM expenses`
//     }
//     return expenses
//
//   }
//
//     async list_expenses_date(){
//         let expenses
//         expenses = await sql`SELECT date FROM expenses`
//         return expenses
//     }
//
//     async filter_expenses(type, start_date, end_date) {
//         try{
//             let expenses
//             expenses = await sql`SELECT *
//                                FROM expenses
//                                WHERE type ILIKE '%' || ${type} || '%'
//                                  AND date BETWEEN ${start_date}::date AND ${end_date}::date;
//           `
//             return expenses
//         }
//         catch (error){
//             console.error("Error updating expense:", error);
//             throw error; // rethrow so caller can handle
//         }
//     }
//
//   async edit_expenses(expenseID, expense) {
//     const { title, type, value, payment, date, beneficiary,  } = expense
//     try{
//       await sql`UPDATE expenses SET  title = ${title}, type = ${type}, value = ${value}, payment = ${payment}, date = ${date}, beneficiary = ${beneficiary} WHERE id = ${expenseID}`
//     }
//     catch (error){
//       console.error("Error updating expense:", error);
//       throw error; // rethrow so caller can handle
//     }
//   }
//
//   async delete_expenses(expenseID) {
//     await sql`DELETE FROM expenses WHERE ID = ${expenseID}`
//   }
// }
//
// export class dataBasePostgresMembers {
//
//   async create_members(member) {
//     try {
//         return await sql`
//       INSERT INTO members (name, cellphone, date_birth, pixkey, pixtype)
//       VALUES (${member.name}, ${member.cellphone}, ${member.date_birth}, ${member.pixkey}, ${member.pixtype})
//       RETURNING *;
//     `; // usually returns an array of rows
//     } catch (error) {
//       console.error("Error inserting member:", error);
//       throw error; // rethrow so caller can handle
//     }
//
//   }
//
//   async list_members(search) {
//     let members
//     if (search){
//       members = await sql `SELECT * FROM members WHERE name ILIKE ${'%'+ search + '%'}`
//     } else {
//       members = await sql`SELECT * FROM members`
//     }
//     return members
//   }
//   async edit_members(memberID, member) {
//     const { name,  } = member
//     await sql`UPDATE members SET name = ${name} WHERE id = ${memberID}`
//   }
//   async delete_members(memberID) {
//     await sql`DELETE FROM members WHERE id = ${memberID}`
//   }
// }
//
// export class dataBasePostgresCompanies {
//   async create_company(company) {
//       try {
//           return await sql`INSERT INTO companies (
//     CNPJ,
//     company_name,
//     fantasy_name,
//     estate_registration,
//     municipal_registration,
//     open_date,
//     situation,
//     cep,
//     street,
//     number,
//     complement,
//     neighborhood,
//     city,
//     UF,
//     cellphone,
//     email,
//     CNAE,
//     activity_description,
//     pixkey,
//     pixtype
//     ) VALUES (
//     ${company.CNPJ},
//     ${company.company_name},
//     ${company.fantasy_name},
//     ${company.estate_registration},
//     ${company.municipal_registration},
//     ${company.open_date},
//     ${company.situation},
//     ${company.cep},
//     ${company.street},
//     ${company.number},
//     ${company.complement},
//     ${company.neighborhood},
//     ${company.city},
//     ${company.UF},
//     ${company.cellphone},
//     ${company.email},
//     ${company.CNAE},
//     ${company.activity_description},
//     ${company.pixkey},
//     ${company.pixtype}
//     ) RETURNING *`
//   }
//     catch (error) {
//       console.error("Error inserting company:", error);
//       throw error; // rethrow so caller can handle
//     }
//   }
//
//
//   async list_companies(search) {
//     let companies
//     try {
//         if (search) {
//             companies = await sql`SELECT *
//                               FROM companies
//                               WHERE company_name ILIKE '%' || ${search} || '%'
//                                 OR fantasy_name ILIKE '%' || ${search} || '%'
//                                 OR cnpj ILIKE '%' || ${search} || '%'
//                                 OR estate_registration ILIKE '%' || ${search} || '%'
//                                 OR municipal_registration ILIKE '%' || ${search} || '%'
//                                 OR cnae ILIKE '%' || ${search} || '%'
//                                 OR activity_description ILIKE '%' || ${search} || '%'
//                                 OR pixkey ILIKE '%' || ${search} || '%' ;
//         `
//         } else {
//           companies = await sql`SELECT * FROM companies`
//         }
//         return companies
//     }
//     catch (error) {
//       console.error("Error listing companies:", error);
//       throw error; // rethrow so caller can handle
//     }
//   }
//
//
//   async edit_companies(companyID, company) {
//     const { CNPJ, company_name, fantasy_name, estate_registration, municipal_registration, open_date, situation, cep, street, number, complement, neighborhood, city, UF, cellphone, email, CNAE, activity_description, pixkey, pixtype,  } = company
//
//     try {await sql`UPDATE companies SET  CNPJ = ${CNPJ}, company_name = ${company_name}, fantasy_name = ${fantasy_name}, estate_registration = ${estate_registration}, municipal_registration = ${municipal_registration}, open_date = ${open_date}, situation = ${situation}, cep = ${cep}, street = ${street}, number = ${number}, complement = ${complement}, neighborhood = ${neighborhood}, city = ${city}, UF = ${UF}, cellphone = ${cellphone}, email = ${email}, CNAE = ${CNAE}, activity_description = ${activity_description}, pixkey = ${pixkey}, pixtype = ${pixtype} WHERE id = ${companyID}`}
//     catch (error) {
//       console.error("Error updating company:", error);
//       throw error; // rethrow so caller can handle
//     }
//   }
//   async delete_companies(companyID) {
//     try {
//       await sql`DELETE FROM companies WHERE id = ${companyID}`
//   }
//     catch (error) {
//       console.error("Error deleting company:", error);
//       throw error; // rethrow so caller can handle
//     }
//   }
// }