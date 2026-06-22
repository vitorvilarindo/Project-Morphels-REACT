import { ScopeValidationService } from "../Services/scopeValidationService.js";
import { FilterService } from "../Services/filterService.js";
import { RevenuesRepository } from "../Repositories/revenuesRepository.js";
import { RevenuesController } from "../Controllers/revenuesController.js";

export default async function revenuesRoutes(server) {
    const revenuesRepository = new RevenuesRepository();
    const filterService = new FilterService(server.services.validationService);
    const revenuesController = new RevenuesController(filterService, server.services.validationService, revenuesRepository);


    server.post("/revenues", {preHandler: server.checkPermissions("can_add"),handler: revenuesController.create})
    server.get("/revenues", {preHandler: server.checkPermissions("can_view"),handler: revenuesController.list})
    server.post("/revenues/filter", {preHandler: server.checkPermissions("can_view"),handler: revenuesController.filter})
    server.put("/revenues/:id", {preHandler: server.checkPermissions("can_edit"),handler: revenuesController.update})
    server.delete("/revenues/:id", {preHandler: server.checkPermissions("can_delete"),handler: revenuesController.delete})
}
