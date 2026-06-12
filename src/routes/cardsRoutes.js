import { CardsRepository } from "../Repositories/cardsRepository.js"
import { ScopeValidationService } from "../Services/scopeValidationService.js"
import { CardsController } from "../Controllers/cardsController.js"

export default async function cardsRoutes(server) {
    const cardsRepository = new CardsRepository()
    const scopeValidationService = new ScopeValidationService(cardsRepository)
    const cardsController = new CardsController(cardsRepository, scopeValidationService)


    server.post("/cards", {preHandler: server.checkPermissions("can_add"), handler: cardsController.create})
    server.get("/cards", {preHandler: server.checkPermissions("can_view"), handler: cardsController.list})
    server.put("/cards/:id", {preHandler: server.checkPermissions("can_edit"), handler: cardsController.update})
    server.delete("/cards/:id", {preHandler: server.checkPermissions("can_delete"), handler: cardsController.delete})
}