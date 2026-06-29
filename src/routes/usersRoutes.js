import { UserRepository } from '../Repositories/userRepository.js'
import { AuthService } from '../Services/authService.js'
import { GetUserInfos } from '../Services/getUserInfos.js'
import { UserController } from '../controllers/usersController.js'

export default async function usersRoutes(server) {
    const userRepo = new UserRepository();
    const authService = new AuthService(userRepo);
    const getUserInfos = new GetUserInfos(userRepo, server.repositories.branchesRepository, server.repositories.sectorsRepository);
    const userController = new UserController(authService, userRepo, getUserInfos);

    server.post("/users", {preHandler: server.checkPermissions("can_add"),handler: userController.create})
    server.get('/users', {preHandler: server.checkPermissions("can_view"),handler: userController.list})
    server.get('/users/infos', {preHandler: server.checkPermissions("can_view"),handler: userController.getInfos})
    server.post("/users/login", userController.login)
    server.put("/users/:id", {preHandler: server.checkPermissions("can_edit"),handler: userController.edit})
    server.delete("/users/:id", {preHandler: server.checkPermissions("can_delete"),handler: userController.delete})
}
