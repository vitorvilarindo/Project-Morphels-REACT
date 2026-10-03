export default async function revenuesRoutes(server) {
    const revenuesController = server.controllers.revenues

    server.post("/", {preHandler: server.checkPermissions("can_add"),handler: revenuesController.create})
    server.get("/", {preHandler: server.checkPermissions("can_view"),handler: revenuesController.list})
    server.get("/:start_date/:end_date", {preHandler: server.checkPermissions("can_view"),handler: revenuesController.listWithDates})
    server.put("/:id", {preHandler: server.checkPermissions("can_edit"),handler: revenuesController.update})
    server.delete("/:id", {preHandler: server.checkPermissions("can_delete"),handler: revenuesController.delete})
}
