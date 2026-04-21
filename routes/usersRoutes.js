import {
    createUser,
    login,
    profile,
    editUser,
    deleteUser, listUsers
} from "../controllers/usersController.js"


export default async function usersRoutes(server) {
    server.post("/users", {preHandler: server.checkPermissions("can_add"),handler: createUser})
    server.get('/users', {preHandler: server.checkPermissions("can_view"),handler: listUsers})
    server.post("/users/login", login)
    server.post("/users/profile", profile)
    server.put("/users/:id", {preHandler: server.checkPermissions("can_edit"),handler: editUser})
    server.delete("/users/:id", {preHandler: server.checkPermissions("can_delete"),handler: deleteUser})
}
