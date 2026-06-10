export class BranchesController {
    constructor(branchesRepository) {
        this.branchesRepository = branchesRepository
    }
    create = async (request, reply) =>{
        try {
            const branchCreate = await this.branchesRepository.createBranch(request.body, request.userID)
            if (!branchCreate){
                return reply.status(303).send({message: `Branch could not be created.`})
            }
            return reply.status(200).send({message: `Branch created successfully.`})
        }    catch (e) {
            console.error(e)
            return reply.status(400).send({message: `Branch could not be created.`})
        }
    }
    list = async (request, reply) =>{
        try{
            const branches = await this.branchesRepository.listBranches(request.userID)
            if (!branches) {
                return reply.status(404).send({message: `Branch not found`})
            }
            return reply.status(200).send({message: `Branches list successfully.`})
        }catch (e) {
            console.error(e)
            return reply.status(400).send(branches)
        }
    }
    update = async (request, reply) =>{
        try{
            const branchUpdate = await this.branchesRepository.updateBranch(request.body, request.params.id)
            if (!branchUpdate){
                return reply.status(404).send({message: `Branch not found`})
            }
            return reply.status(200).send({message: `Branch updated successfully.`})
        }catch (e) {
            console.error(e)
            return reply.status(400).send({message: `Branches list not found`})
        }
    }
    delete = async (request, reply) =>{
        try{
            const branchDeleted = await this.branchesRepository.deleteBranch(request.params.id)
            if (!branchDeleted){
                return reply.status(404).send({message: `Branch not found`})
            }
            return reply.status(200).send({message: `Branch deleted successfully.`})
        }catch (e) {
            console.error(e)
            return reply.status(500).send({message: `Branches list not found`})
        }
    }
}