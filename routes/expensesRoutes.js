import {
    createExpense,
    listExpenses,
    filterExpenses,
    editExpense,
    deleteExpense
} from "../controllers/expensesController.js"

export default async function expensesRoutes(server) {
    server.post("/expenses", { preHandler: server.checkPermissions("insert_data"), handler: createExpense })
    server.get("/expenses", listExpenses)
    server.get("/expenses/filter", filterExpenses)
    server.put("/expenses/:id", { preHandler: server.checkPermissions("update_data"), handler: editExpense })
    server.delete("/expenses/:id", { preHandler: server.checkPermissions("delete_data"), handler: deleteExpense })
}
