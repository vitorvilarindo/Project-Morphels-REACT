export class SectorsController {
    constructor(sectorRepository) {
        this.repository = sectorRepository
    }

    create = async (request, reply) => {
        try{
            const createSector = await this.repository.createSector(request.body, request.userID)
            if (createSector.length === 0) {
                return reply.status(303).send({message: "O setor não pode ser criado"})
            }
            return reply.status(201).send({message: 'Setor criado com sucesso'})
        }catch(err){
            console.error(err)
            return reply.status(500).send({message: "O sertor não pode ser criado por um erro interno"})
        }
    }
    list = async (request, reply) => {
        try{
            const sectors = await this.repository.listSectors(request.userID)
            if (sectors.length === 0) {
                return reply.status(404).send({message: "Não foi possível localizar nenhum setor"})
            }
            return reply.status(201).send(sectors)
        }catch(err){
            console.error(err)
            return reply.status(503).send({message: err})
        }
    }
    getById = async (request, reply) => {
        try{
            const sector = await this.repository.findSectorById(request.params.id)
            if (sector.length === 0) {
                return reply.status(404).send({message: "Não foi possível localizar nenhum setor"})
            }
            return reply.status(201).send(sector)
        }catch(err){
            console.error(err)
            return reply.status(503).send({message: err})
        }
    }
    update = async (request, reply) => {
        try{
            const updateSector = await this.repository.updateSector(request.body, request.params.id)
            if (!updateSector) {
                return reply.status(303).send({message: "Não foi possível editar o sector"})
            }
            return reply.status(200).send({message: 'Setor atualizado com sucesso'})
        }catch(err){
            console.error(err)
            return reply.status(503).send({message: "Não foi possível atualizar o sertor por um erro interno"})
        }
    }
    delete = async (request, reply) => {
        try{
            const deleteSector = await this.repository.deleteSector(request.params.id)
            if (deleteSector.length === 0) {
                return reply.status(404).send({message: "Setor não encontrado"})
            }
            return reply.status(200).send({message: 'Setor deletado com sucesso'})
        }catch(err){
            console.error(err)
            return reply.status(503).send({message: "Não foi possível deletar o sertor por um erro interno"})
        }
    }
}
