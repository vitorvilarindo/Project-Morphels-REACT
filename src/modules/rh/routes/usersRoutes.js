export default async function usersRoutes(server) {
    const userController = server.controllers.users

    server.post("/", {config:{ rateLimit: {max: 5, timeWindow: '5 minute'}}, preHandler: server.checkPermissions("can_add"),handler: userController.create})
    server.post("/login", userController.login)
    server.get('/', {preHandler: server.checkPermissions("can_view"),handler: userController.list})
    server.get('/:id', {preHandler: server.checkPermissions("can_view"),handler: userController.getById})
    server.get('/infos', {preHandler: server.checkPermissions("can_view"),handler: userController.getInfos})
    server.put("/:id", {preHandler: server.checkPermissions("can_edit"),handler: userController.edit})
    server.delete("/:id", {preHandler: server.checkPermissions("can_delete"),handler: userController.delete})
}
