import {MembersRepository} from '../Repositories/membersRepository.js'
import {ScopeValidationService} from '../Services/scopeValidationService.js'
import {MembersController} from '../Controllers/membersController.js'

export default async function revenuesRoutes(server) {
    const membersRepository = new MembersRepository()
    const scopeValidationService = new ScopeValidationService(membersRepository)
    const membersController = new MembersController(membersRepository, scopeValidationService)

    server.post("/members", {preHandler: server.checkPermissions("can_add"),handler: membersController.create})
    server.get("/members", {preHandler: server.checkPermissions("can_view"),handler: membersController.update})
    // server.get("/members/filter", filterRevenues)
    server.put("/members/:id", {preHandler: server.checkPermissions("can_edit"),handler: membersController.update})
    server.delete("/members/:id", {preHandler: server.checkPermissions("can_delete"),handler: membersController.delete})
}
