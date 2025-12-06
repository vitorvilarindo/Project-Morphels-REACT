import "dotenv/config";
import bcrypt from "bcrypt"
import {sql} from "../db.js";

export class dataBasePostgresExpenses {

    async create_expense(expense) {

        return await sql`INSERT INTO expenses (title, type, value, payment, date, beneficiary ) VALUES (${expense.title}, ${expense.type}, ${expense.value}, ${expense.payment}, ${expense.date}, ${expense.beneficiary}) RETURNING *`
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
        const { title, type, value, payment, date, beneficiary,  } = expense
        try{
            await sql`UPDATE expenses SET  title = ${title}, type = ${type}, value = ${value}, payment = ${payment}, date = ${date}, beneficiary = ${beneficiary} WHERE id = ${expenseID}`
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