import { RevenuesRepository } from "../Repositories/revenuesRepository.js";
import { AuthService } from "../Services/revenuesService.js";
import { RevenuesController } from "../Controllers/revenuesController.js";

export default async function revenuesRoutes(server) {
    const revenuesRepository = new RevenuesRepository();
    const authService = new AuthService(revenuesRepository);
    const revenuesController = new RevenuesController(authService, revenuesRepository);


    server.post("/revenues", {preHandler: server.checkPermissions("can_add"),handler: revenuesController.create})
    server.get("/revenues", {preHandler: server.checkPermissions("can_view"),handler: revenuesController.list})
    server.post("/revenues/filter", {preHandler: server.checkPermissions("can_view"),handler: filterRevenues})
    server.put("/revenues/:id", {preHandler: server.checkPermissions("can_edit"),handler: revenuesController.update})
    server.delete("/revenues/:id", {preHandler: server.checkPermissions("can_delete"),handler: revenuesController.delete})
}
