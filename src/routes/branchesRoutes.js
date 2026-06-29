import { BranchesRepository } from "../Repositories/branchesRepository.js"
import { BranchesController } from "../controllers/branchesController.js"

export default async function branchesRoutes(server) {
    const branchesRepository = new BranchesRepository()
    const branchesController = new BranchesController(branchesRepository)

    server.post("/churchs", {preHandler: server.checkPermissions("can_add"),handler: branchesController.create})
    server.get("/churchs", {preHandler: server.checkPermissions("can_view"),handler: branchesController.list})
    server.put("/churchs/:id", {preHandler: server.checkPermissions("can_edit"),handler: branchesController.update})
    server.delete("/churchs/:id", {preHandler: server.checkPermissions("can_delete"),handler: branchesController.delete})
}
