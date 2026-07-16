export default async function branchesRoutes(server) {
    const branchesController = server.controllers.branches

    server.post("/branches", {preHandler: server.checkPermissions("can_add"),handler: branchesController.create})
    server.get("/branches", {preHandler: server.checkPermissions("can_view"),handler: branchesController.list})
    server.put("/branches/:id", {preHandler: server.checkPermissions("can_edit"),handler: branchesController.update})
    server.delete("/branches/:id", {preHandler: server.checkPermissions("can_delete"),handler: branchesController.delete})
}
