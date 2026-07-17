export default async function reportsRoutes(server) {
    const reportsController = server.controllers.reports

    server.post("/reports", {preHandler: server.checkPermissions("can_add"), handler: reportsController.create})
    server.get("/reports", {preHandler: server.checkPermissions("can_view"), handler: reportsController.list});
    server.put("/reports", {preHandler: server.checkPermissions("can_edit"), handler: reportsController.update})
    server.delete("/reports/:id", {preHandler: server.checkPermissions("can_delete"), handler: reportsController.delete})
    server.post("/reports/finance/:id", {preHandler: server.checkPermissions("can_view"), handler: reportsController.getFinanceReportsData})
}