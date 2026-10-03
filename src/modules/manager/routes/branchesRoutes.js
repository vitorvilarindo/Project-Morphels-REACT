export default async function branchesRoutes(server) {
    const branchesController = server.controllers.branches

    server.post("/", {preHandler: server.checkPermissions("can_add"),handler: branchesController.create})
    server.get("/", {preHandler: server.checkPermissions("can_view"),handler: branchesController.list})
    server.get("/:id", {preHandler: server.checkPermissions("can_view"),handler:branchesController.getById})
    server.put("/:id", {preHandler: server.checkPermissions("can_edit"),handler: branchesController.update})
    server.delete("/:id", {preHandler: server.checkPermissions("can_delete"),handler: branchesController.delete})
}
