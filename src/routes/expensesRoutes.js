export default async function expensesRoutes(server) {
    const expensesController = server.controllers.expenses

    server.post("/expenses", { preHandler: server.checkPermissions("can_add"),handler:  expensesController.create })
    server.get("/expenses", {preHandler: server.checkPermissions("can_view"),handler: expensesController.list})
    server.get("/expenses/filter", {preHandler: server.checkPermissions("can_view"),handler: expensesController.filter})
    server.put("/expenses/:id", {preHandler: server.checkPermissions("can_edit"),handler: expensesController.update})
    server.delete("/expenses/:id", {preHandler: server.checkPermissions("can_delete"),handler: expensesController.delete })
}
