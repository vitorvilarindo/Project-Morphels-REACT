import { CompaniesRepository } from "../Repositories/companiesRepository.js"
import { CompaniesController } from "../Controllers/companiesController.js"

export default async function companiesRoutes(server) {
    const companiesRepository = new CompaniesRepository()
    const companiesController = new CompaniesController(companiesRepository)

    server.post("/companies", {preHandler: server.checkPermissions("can_add"),handler: companiesController.create})
    server.get("/companies", {preHandler: server.checkPermissions("can_view"),handler: companiesController.list})
    server.put("/companies/:id", {preHandler: server.checkPermissions("can_edit"),handler: companiesController.update}
    server.delete("/companies/:id", {preHandler: server.checkPermissions("can_delete"),handler: companiesController.delete})
}
