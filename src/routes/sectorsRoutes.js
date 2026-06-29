import {SectorsRepository} from '../Repositories/sectorsRepository.js'
import {SectorsController} from '../controllers/sectorsController.js'

export default async function sectorsRoutes(server) {
    const sectorRepository = new SectorsRepository()
    const sectorController = new SectorsController(sectorRepository)

    server.post('/sectors', {preHandler: server.checkPermissions("can_add"),handler: sectorController.create})
    server.get('/sectors', {preHandler: server.checkPermissions("can_view"),handler: sectorController.list})
    server.put('/sectors/:id', {preHandler: server.checkPermissions("can_edit"),handler: sectorController.update})
    server.delete('/sectors/:id', {preHandler: server.checkPermissions("can_delete"),handler: sectorController.delete})
}
