import { dataBasePostgresExpenses } from "../controllers/expensesController.js";

const database_expenses = new dataBasePostgresExpenses()

export default async function expensesRoutes(server, opts){
    server.post('/expenses', async (request, reply) => {
        const { title, type, value, payment, date, beneficiary } = request.body
        await database_expenses.create_expense({
            title,
            type,
            value,
            payment,
            date,
            beneficiary,
            user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"
        })
        reply.status(201).send()
        console.log("Deu bom")
    })

    server.get('/expenses', async (request, reply) => {
        const search = request.query.search
        const expenses = await database_expenses.list_expenses(search)
        return reply.status(200).send(expenses)
    })

    server.get('/expenses/filter', async (request, reply) => {
        let type = request.query.type
        let start_date = request.query.date1
        let end_date = request.query.date2


        if (type === "All"){
            type = ""
        }

        if(start_date === ""){
            const expenses_date = await database_expenses.list_expenses_date()
            const timestamps = expenses_date.map(d => new Date(d.date).getTime());

            start_date = new Date(Math.min(...timestamps));
        }
        if (end_date === ""){
            const expenses_date = await database_expenses.list_expenses_date()
            const timestamps = expenses_date.map(d => new Date(d.date).getTime());

            end_date = new Date(Math.max(...timestamps))
        }

        const expenses = await database_expenses.filter_expenses(type, start_date, end_date)

        return reply.status(200).send(expenses)
    })
    server.put('/expenses/:id', async (request,reply) => {
        const expenseID = request.params.id
        const {title, category, value, payment, date, beneficiary} = request.body
        await database_expenses.edit_expenses(expenseID, {
            title,
            category,
            value,
            payment,
            date,
            beneficiary,
            user_id: "422a0acd-0210-4723-9622-c2b554ee8d60"
        })
        return reply.status(204).send()
    })
    server.delete('/expenses/:id', async (request, reply) => {
        const expenseID = request.params.id
        await database_expenses.delete_expenses(expenseID )
        return reply.status(204).send()
    })
}