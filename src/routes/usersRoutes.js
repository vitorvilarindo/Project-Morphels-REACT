import {AuthService} from '../Services/userSevices.js';
import {UserRepository} from '../Repositories/userRepository.js';
import {UserController} from '../Controllers/usersController.js';

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const userController = new UserController(authService, userRepo);


export default async function usersRoutes(server) {
    server.post("/users", {preHandler: server.checkPermissions("can_add"),handler: createUser})
    server.get('/users', {preHandler: server.checkPermissions("can_view"),handler: userController.list})
    server.post("/users/login", userController.login)
    server.post("/users/profile", profile)
    server.put("/users/:id", {preHandler: server.checkPermissions("can_edit"),handler: editUser})
    server.delete("/users/:id", {preHandler: server.checkPermissions("can_delete"),handler: deleteUser})
}
