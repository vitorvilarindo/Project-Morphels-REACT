import {
    listSectors,
    createSector,
    updateSector,
    deleteSector
} from '../controllers/sectorsController.js'

export default async function sectorsRoutes(server) {
    server.get('/sectors', listSectors)
    server.post('/sectors', createSector)
    server.put('/sectors/:id', updateSector)
    server.delete('/sectors/:id', deleteSector)
}
