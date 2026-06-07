export class ReportsController {
    constructor(repostsRepository, scopeValidationService) {
        this.repository = repostsRepository
        this.validationService = scopeValidationService
    }
    create = async (request, reply) => {
        try{
            const createReport = await this.repository.createReport(request.body, request.userID)
            if (!createReport){
                return reply.status(303).send({error: "Failed to create report"})
            }
            return reply.status(201).send({error: "Successfully create report"})
        }catch(err){
            console.log(err)
            return reply.status(500).send({error: "Failed to create report"})
        }
    }
    list = async (request, reply) => {
        try{
            const reposts = await this.validationService.validateAccessScope(request.access_scope, request.userID, request.query.search)
            return reply.status(200).send(reposts)
        }catch(err){
            console.log(err)
            return reply.status(500).send({error: "Failed to list"})
        }
    }
    update = async (request, reply) => {
        try{
            const updateReport = await this.repository.updateReport(request.body, request.params.id)
            if (!updateReport){
                return reply.status(303).send({error: "Failed to update report"})
            }
            return reply.status(201).send({error: "Successfully update report"})
        }catch(err){
            console.log(err)
            return reply.status(500).send({error: "Failed to update report"})
        }
    }
    delete = async (request, reply) => {
        try{
            const deleteReport = await this.repository.deleteReport(request.params.id)
            if (!deleteReport){
                return reply.status(303).send({error: "Failed to delete report"})
            }
            return reply.status(201).send({error: "Successfully delete report"})
        }catch(err){
            console.log(err)
            return reply.status(500).send({error: "Failed to delete report"})
        }
    }
}
