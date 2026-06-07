import {ReportsRepository} from '../Repositories/reportsRepository.js'
import {ScopeValidationService} from '../Services/scopeValidationService.js'
import {ReportsController} from '../Controllers/reportsController.js'

export default async function repostsRotes(server){
    const reportsRepository = new ReportsRepository()
    const scopeValidationService = new ScopeValidationService(reportsRepository)
    const reportsController = new ReportsController(reportsRepository, scopeValidationService)

    server.post("/reports", {preHandler: server.checkPermissions("can_add"),handler: reportsController.create})
    server.get("/reports", {preHandler: server.checkPermissions("can_view"),handler: reportsController.list});
    server.put("/reports", {preHandler: server.checkPermissions("can_edit"),handler: reportsController.update})
    server.delete("reports", {preHandler: server.checkPermissions("can_delete"),handler: reportsController.delete})
    server.post("/reports/local", localReportsData)
}