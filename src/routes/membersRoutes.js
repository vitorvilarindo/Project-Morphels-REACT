export default async function revenuesRoutes(server) {
    const membersController = server.controllers.members

    server.post("/members", {preHandler: server.checkPermissions("can_add"),handler: membersController.create})
    server.get("/members", {preHandler: server.checkPermissions("can_view"),handler: membersController.list})
    server.put("/members/:id", {preHandler: server.checkPermissions("can_edit"),handler: membersController.update})
    server.delete("/members/:id", {preHandler: server.checkPermissions("can_delete"),handler: membersController.delete})
}
