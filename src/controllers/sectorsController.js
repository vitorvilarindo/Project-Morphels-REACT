export class SectorsController {
    constructor(sectorRepository) {
        this.repository = sectorRepository
    }

    create = async (request, reply) => {
        try{
            const createSector = await this.repository.createSector(request.body, request.userID)
            if (!createSector) {
                return reply.status(303).send({error: "Sector could not be created"})
            }
            return reply.status(201).send({message: 'Sector created successfully'})
        }catch(err){
            console.error(err)
            return reply.status(500).send({error: err})
        }
    }
    list = async (request, reply) => {
        try{
            const sectors = await this.repository.listSectors(request.userID)
            return reply.status(200).send(sectors)
        }catch(err){
            console.error(err)
            return reply.status(500).send({error: err})
        }
    }
    update = async (request, reply) => {
        try{
            const updateSector = await this.repository.updateSector(request.body, request.params.id)
            if (!updateSector) {
                return reply.status(303).send({error: "Sector could not be updated"})
            }
            return reply.status(200).send({message: 'Sector updated successfully'})
        }catch(err){
            console.error(err)
            return reply.status(500).send({error: err})
        }
    }
    delete = async (request, reply) => {
        try{
            const deleteSector = await this.repository.deleteSector(request.params.id)
            if (!deleteSector) {
                return reply.status(303).send({error: "Sector could not be deleted"})
            }
            return reply.status(200).send({message: 'Sector deleted successfully'})
        }catch(err){
            console.error(err)
            return reply.status(500).send({error: err})
        }
    }
}
