import {ReportsRepository} from '../Repositories/reportsRepository.js'
import {GetFinanceDataToReports} from '../Services/getFinanceDataToReports.js'
import {ReportsController} from '../Controllers/reportsController.js'

export default async function repostsRotes(server) {
    const reportsRepository = new ReportsRepository()
    const getFinanceDataToReports = new GetFinanceDataToReports(server.repositories.revenuesRepository, server.repositories.expensesRepository, server.services.validationService, reportsRepository)
    const reportsController = new ReportsController(reportsRepository, server.services.validationService, getFinanceDataToReports)

    server.post("/reports", {preHandler: server.checkPermissions("can_add"), handler: reportsController.create})
    server.get("/reports", {preHandler: server.checkPermissions("can_view"), handler: reportsController.list});
    server.put("/reports", {preHandler: server.checkPermissions("can_edit"), handler: reportsController.update})
    server.delete("/reports", {preHandler: server.checkPermissions("can_delete"), handler: reportsController.delete})
    server.post("/reports/finance/:id", {preHandler: server.checkPermissions("can_view"), handler: reportsController.getFinanceReportsData})
}