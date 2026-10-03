export default async function sectorsRoutes(server) {
    const sectorController = server.controllers.sectors

    server.post('/', {preHandler: server.checkPermissions("can_add"),handler: sectorController.create})
    server.get('/', {preHandler: server.checkPermissions("can_view"),handler: sectorController.list})
    server.get('/:id', {preHandler: server.checkPermissions("can_view"),handler: sectorController.getById})
    server.put('/:id', {preHandler: server.checkPermissions("can_edit"),handler: sectorController.update})
    server.delete('/:id', {preHandler: server.checkPermissions("can_delete"),handler: sectorController.delete})
}
