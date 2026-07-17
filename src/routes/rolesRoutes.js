export default async function rolesRoutes(server) {
    const rolesController = server.controllers.roles

    server.post("/roles", {preHandler: server.checkPermissions("can_add"),handler: rolesController.create})
    server.get("/roles", {preHandler: server.checkPermissions("can_view"),handler: rolesController.list})
    server.put("/roles/:id", {preHandler: server.checkPermissions("can_edit"),handler: rolesController.update})
    server.delete("/roles/:id", {preHandler: server.checkPermissions("can_delete"),handler: rolesController.delete})
}
