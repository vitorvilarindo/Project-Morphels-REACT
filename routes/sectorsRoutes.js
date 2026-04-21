import {
    listSectors,
    createSector,
    updateSector,
    deleteSector
} from '../controllers/sectorsController.js'

export default async function sectorsRoutes(server) {
    server.post('/sectors', {preHandler: server.checkPermissions("can_add"),handler: createSector})
    server.get('/sectors', {preHandler: server.checkPermissions("can_view"),handler: listSectors})
    server.put('/sectors/:id', {preHandler: server.checkPermissions("can_edit"),handler: updateSector})
    server.delete('/sectors/:id', {preHandler: server.checkPermissions("can_delte"),handler: deleteSector})
}
