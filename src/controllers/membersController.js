export class MembersController {
    constructor(membersRepository, scopeValidationService, branchesValidationService) {
        this.repository = membersRepository
        this.validationService = scopeValidationService;
        this.branchesValidationService = branchesValidationService
    }
    create = async (request, reply) => {
        try{
            await this.branchesValidationService.validateAccess(request.access_scope, request.userID, request.userBranch, request.body.branch)
            const memberCreated = await this.repository.createMember(request.body);
            if (!memberCreated) {
                return reply.status(400).send({error: "Failed to create report"})
            }
            return reply.status(201).send({error: "Member created successfully"})
        }catch(err){
            if (err.statusCode){
                return reply.status(err.statusCode).send({error: err.message})
            }
            console.log(err)
            return reply.status(500).send({error: "Failed to create report"})
        }
    }
    list = async (request, reply) => {
        try{
            const members = await this.validationService.validateAccessScope(this.repository, request.access_scope, request.userID, request.query.search)
            if (!members) {
                return reply.status(400).send({error: "Failed to list of members"})
            }
            return reply.status(200).send(members)
        }catch(err){
            console.log(err)
            return reply.status(500).send({error: "Failed to list of members"})
        }
    }
    update = async (request, reply) => {
        try{
            const memberUpdated = await this.repository.updateMember(request.body, request.params.id);
            if (!memberUpdated) {
                return reply.status(400).send({error: "Failed to update report"})
            }
            return reply.status(200).send({error: "Member updated successfully"})
        }catch(err){
            console.log(err)
            return reply.status(500).send({error: "Failed to update report"})
        }
    }
    delete = async (request, reply) => {
        try{
            const memberDeleted = await this.repository.deleteMember(request.params.id);
            if (!memberDeleted) {
                return reply.status(400).send({error: "Failed to delete report"})
            }
            return reply.status(200).send({error: "Member deleted successfully"})
        }catch(err){
            console.log(err)
            return reply.status(500).send({error: "Failed to delete report"})
        }
    }
}