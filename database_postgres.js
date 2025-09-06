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
    
    const users = await sql`INSERT INTO revenues (member, type, payment, reference_mounth, date, user_id) VALUES (${revenue.member}, ${revenue.type}, ${revenue.payment}, ${revenue.reference_mounth}, ${revenue.date}, ${revenue.user_id}) RETURNING *`
    return users
  }
  async list_user(search) {
    let revenues
    if (search) {
       revenues = await sql`SELECT * FROM revenues WHERE member ILIKE ${'%' + search + '%'  }`
    } else {
      revenues = await sql`SELECT * FROM revenues`
    }

    return users

  }

  async edit_user(revenueID, revenue) {
    const { member, type, payment, reference_mounth, date, user_id } = revenue

    await sql`UPDATE revenues SET  member = ${member}, type = ${type}, payment = ${payment}, reference_mounth = ${reference_mounth}, date = ${date}, user_is = ${user_id} WHERE id = ${revenueID}`
  }

  async delete_user(revenueID) {
    await sql`DELETE FROM revenues WHERE id = ${revenueID}`
  }
}
