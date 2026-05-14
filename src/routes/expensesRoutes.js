import {
    createExpense,
    listExpenses,
    filterExpenses,
    editExpense,
    deleteExpense
} from "../controllers/expensesController.js"

export default async function expensesRoutes(server) {
    server.post("/expenses", { preHandler: server.checkPermissions("can_add"),handler:  createExpense })
    server.get("/expenses", {preHandler: server.checkPermissions("can_view"),handler: listExpenses})
    server.get("/expenses/filter", {preHandler: server.checkPermissions("can_view"),handler: filterExpenses})
    server.put("/expenses/:id", {preHandler: server.checkPermissions("can_edit"),handler: editExpense })
    server.delete("/expenses/:id", {preHandler: server.checkPermissions("can_delete"),handler: deleteExpense })
}
