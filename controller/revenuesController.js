import "dotenv/config";
import bcrypt from "bcrypt"
import {sql} from "../db.js";

export class dataBasePostgresRevenues {

    async create_revenue(revenue) {

        return await sql`INSERT INTO revenues (member, type, value, payment, date ) VALUES (${revenue.member}, ${revenue.type}, ${revenue.value}, ${revenue.payment}, ${revenue.date}) RETURNING *`
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
        const { member, type, value, payment, date,  } = revenue

        await sql`UPDATE revenues SET  member = ${member}, type = ${type}, value = ${value}, payment = ${payment}, date = ${date} WHERE id = ${revenueID}`
    }

    async delete_revenues(revenueID) {
        try {
            await sql`DELETE FROM revenues WHERE id = ${revenueID}`
        }catch (error){
            console.error("Error updating revenue:", error);
        }


    }
}

