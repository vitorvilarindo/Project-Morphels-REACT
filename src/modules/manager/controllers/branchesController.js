export class BranchesController {
    constructor(branchesRepository, validationService) {
        this.branchesRepository = branchesRepository
        this.scopeValidationService = validationService
    }
    create = async (request, reply) =>{
        try {
            const branchCreate = await this.branchesRepository.createBranch(request.body, request.userID)
            if (branchCreate.length === 0) {
                return reply.status(303).send({message: `Não foi possível criar a filial`})
            }
            return reply.status(201).send({message: `Filial criada com sucesso`})
        }    catch (e) {
            console.error(e)
            return reply.status(503).send({message: `Não foi possível criar a filial por um erro interno`})
        }
    }
    list = async (request, reply) =>{
        try{
            const branches = await this.scopeValidationService.validateAccessScope(this.branchesRepository, request.access_scope, request.userID, request.query.search)
            if (branches.length === 0) {
                return reply.status(404).send({message: `Não foi possível encontrar a filial`})
            }
            return reply.status(201).send(branches)
        }catch (e) {
            console.error(e)
            return reply.status(503).send({message: `Não foi possível encontrar a filial por um erro interno`})
        }
    }
    getById = async (request, reply) =>{
        try{
            const branches = await this.branchesRepository.findBranchById(request.params.id)
            if (branches.length === 0) {
                return reply.status(404).send({message: `Não foi possível encontrar a filial`})
            }
            return reply.status(201).send(branches)
        }catch (e) {
            console.error(e)
            return reply.status(503).send({message: `Não foi possível encontrar a filial por um erro interno`})
        }
    }
    update = async (request, reply) =>{
        try{
            const branchUpdate = await this.branchesRepository.updateBranch(request.body, request.params.id, request.userID)
            if (branchUpdate.length === 0){
                return reply.status(303).send({message: `Não foi possível encontrar a filial`})
            }
            return reply.status(200).send({message: `Filial atualizada com sucesso`})
        }catch (e) {
            console.error(e)
            return reply.status(503).send({message: `Não foi possível atualizar a filial por um erro interno`})
        }
    }
    delete = async (request, reply) =>{
        try{
            const branchDeleted = await this.branchesRepository.deleteBranch(request.params.id)
            if (branchDeleted.length === 0){
                return reply.status(404).send({message: `Não foi possível encontrar a filial`})
            }
            return reply.status(201).send({message: `Filial deletada com sucesso`})
        }catch (e) {
            console.error(e)
            return reply.status(503).send({message: `Não foi possível deletar a filial por um erro interno`})
        }
    }
}