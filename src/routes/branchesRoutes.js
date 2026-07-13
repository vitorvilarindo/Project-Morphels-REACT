export default async function branchesRoutes(server) {
    const branchesController = server.controllers.branches

    server.post("/churchs", {preHandler: server.checkPermissions("can_add"),handler: branchesController.create})
    server.get("/churchs", {preHandler: server.checkPermissions("can_view"),handler: branchesController.list})
    server.put("/churchs/:id", {preHandler: server.checkPermissions("can_edit"),handler: branchesController.update})
    server.delete("/churchs/:id", {preHandler: server.checkPermissions("can_delete"),handler: branchesController.delete})
}
