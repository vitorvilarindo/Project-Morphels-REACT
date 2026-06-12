import { UserRepository } from '../Repositories/userRepository.js'
import { AuthService } from '../Services/authService.js'
import { UserController } from '../Controllers/usersController.js'

export default async function usersRoutes(server) {
    const userRepo = new UserRepository();
    const authService = new AuthService(userRepo);
    const userController = new UserController(authService, userRepo);

    server.post("/users", {preHandler: server.checkPermissions("can_add"),handler: userController.create})
    server.get('/users', {preHandler: server.checkPermissions("can_view"),handler: userController.list})
    server.post("/users/login", userController.login)
    // server.post("/users/profile", profile)
    server.put("/users/:id", {preHandler: server.checkPermissions("can_edit"),handler: userController.edit})
    server.delete("/users/:id", {preHandler: server.checkPermissions("can_delete"),handler: userController.delete})
}
