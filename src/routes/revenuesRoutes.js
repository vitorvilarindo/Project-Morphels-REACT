export default async function revenuesRoutes(server) {
    const revenuesController = server.controllers.revenues

    server.post("/revenues", {preHandler: server.checkPermissions("can_add"),handler: revenuesController.create})
    server.get("/revenues", {preHandler: server.checkPermissions("can_view"),handler: revenuesController.list})
    server.post("/revenues/filter", {preHandler: server.checkPermissions("can_view"),handler: revenuesController.filter})
    server.put("/revenues/:id", {preHandler: server.checkPermissions("can_edit"),handler: revenuesController.update})
    server.delete("/revenues/:id", {preHandler: server.checkPermissions("can_delete"),handler: revenuesController.delete})
}
