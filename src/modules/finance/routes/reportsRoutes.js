export default async function reportsRoutes(server) {
    const reportsController = server.controllers.reports

    server.post("/", {preHandler: server.checkPermissions("can_add"), handler: reportsController.create})
    server.get("/", {preHandler: server.checkPermissions("can_view"), handler: reportsController.list})
    server.get("/:id", {preHandler: server.checkPermissions("can_view"), handler: reportsController.getReportById})
    server.put("/", {preHandler: server.checkPermissions("can_edit"), handler: reportsController.update})
    server.delete("/:id", {preHandler: server.checkPermissions("can_delete"), handler: reportsController.delete})
}