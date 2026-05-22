import { ExpensesRepository } from "../Repositories/expensesRepository.js";
import { ScopeValidationService } from "../Services/scopeValidationService.js";
import { FilterService } from "../Services/filterService.js";
import { ExpensesController } from "../Controllers/expensesController.js";

export default async function expensesRoutes(server) {
    const expensesRepository = new ExpensesRepository();
    const scopeValidationService = new ScopeValidationService(expensesRepository);
    const filterService = new FilterService(scopeValidationService);
    const expensesController = new ExpensesController(scopeValidationService, filterService, expensesRepository);

    server.post("/expenses", { preHandler: server.checkPermissions("can_add"),handler:  expensesController.create })
    server.get("/expenses", {preHandler: server.checkPermissions("can_view"),handler: expensesController.list})
    server.get("/expenses/filter", {preHandler: server.checkPermissions("can_view"),handler: expensesController.filter})
    server.put("/expenses/:id", {preHandler: server.checkPermissions("can_edit"),handler: expensesController.update })
    server.delete("/expenses/:id", {preHandler: server.checkPermissions("can_delete"),handler: expensesController.delete })
}
