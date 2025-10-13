import { randomUUID } from "node:crypto";
import { sql} from "./db.js"; 

export class dataBasePostgresUsers {

  async create_user(user) {
    
    const users = await sql`INSERT INTO users (name, email, password) VALUES (${user.name}, ${user.email}, ${user.password}) RETURNING *`
    return users
  }
    

  async list_user(search) {
    let users
    if (search) {
       users = await sql`SELECT * FROM users WHERE name ILIKE ${'%' + search + '%'  }`
    } else {
      users = await sql`SELECT * FROM users`
    }

    return users

  }

  async edit_user(userID, user) {
    const { name, email, password } = user

    await sql`UPDATE users SET  name = ${name}, email = ${email}, password = ${password} WHERE id = ${userID}`
  }

  async delete_user(userID) {
    await sql`DELETE FROM users WHERE id = ${userID}`
  }

}

export class dataBasePostgresRevenues {

  async create_revenue(revenue) {
    
    const revenues = await sql`INSERT INTO revenues (member, type, payment, reference_mounth, date, user_id) VALUES (${revenue.member}, ${revenue.type}, ${revenue.payment}, ${revenue.reference_mounth}, ${revenue.date}, ${revenue.user_id}) RETURNING *`
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

  async edit_revenues(revenueID, revenue) {
    const { member, type, payment, reference_mounth, date, user_id } = revenue

    await sql`UPDATE revenues SET  member = ${member}, type = ${type}, payment = ${payment}, reference_mounth = ${reference_mounth}, date = ${date}, user_id = ${user_id} WHERE id = ${revenueID}`
  }

  async delete_revenues(revenueID) {
    await sql`DELETE FROM revenues WHERE id = ${revenueID}`
  }
}


//Exprenses
export class dataBasePostgresExpenses {

  async create_expense(expense) { 
    const expenses = await sql`INSERT INTO expenses (title, category, payment, reference_mounth, date, beneficiary, user_id) VALUES (${expense.title}, ${expense.category}, ${expense.payment}, ${expense.reference_mounth}, ${expense.date}, ${expense.beneficiary}, ${expense.user_id}) RETURNING *`
    return users
  }
  async list_expenses(search) {
    let expenses
    if (search) {
       expenses = await sql`SELECT * FROM expenses WHERE title ILIKE ${'%' + search + '%'  }`
    } else {
      expenses = await sql`SELECT * FROM expenses`
    }
    return expenses

  }
  async edit_expenses(expenseID, expense) {
    const { title, category, payment, reference_mounth, date, beneficiary, user_id } = expense
    await sql`UPDATE expenses SET  title = ${title}, catefory = ${category}, payment = ${payment}, reference_mounth = ${reference_mounth}, date = ${date}, beneficiary = ${beneficiary}, user_id = ${user_id} WHERE id = ${expenseID}  ` 
  }
  async delete_expenses(expenseID) {
    await sql`DELETE DROM expenses WHERE ID = ${expenseID}`
  }
}

class dataBasePostgresMembers {

  async create_member(member) {
    const members = await sql`INSERT INTO members (name, user_id) VALUES (${member.name}, ${member.user_id}) RETURNING *` 
    return members
  } 
  async list_member(search) {
    let members
    if (search){
      members = await sql `SELECT * FROM members WHERE name ILIKE ${'%'+ search + '%'}`
    } else {
      members = await sql`SELECT * FROM members`
    }
    return members
  }
  async edit_member(memberID, member) {
    const { name, user_id } = member
    await sql`UPDATE members SET name = ${name}, user_id = ${user_id} WHERE id = ${memberID}`
  }
  async delete_member(memberID) {
    await sql`DELETE FROM members WHERE id = ${memberID}`
  }
}