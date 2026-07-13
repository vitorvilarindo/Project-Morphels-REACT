export default async function usersRoutes(server) {
    const userController = server.controllers.users

    server.post("/users", {preHandler: server.checkPermissions("can_add"),handler: userController.create})
    server.get('/users', {preHandler: server.checkPermissions("can_view"),handler: userController.list})
    server.get('/users/infos', {preHandler: server.checkPermissions("can_view"),handler: userController.getInfos})
    server.post("/users/login", userController.login)
    server.put("/users/:id", {preHandler: server.checkPermissions("can_edit"),handler: userController.edit})
    server.delete("/users/:id", {preHandler: server.checkPermissions("can_delete"),handler: userController.delete})
}
