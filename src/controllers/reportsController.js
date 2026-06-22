export class ReportsController {
    constructor(repostsRepository, scopeValidationService, getFinanceReportsData) {
        this.repository = repostsRepository
        this.validationService = scopeValidationService
        this.getFinanceData = getFinanceReportsData
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
            const reposts = await this.validationService.validateAccessScope(this.repository, request.access_scope, request.userID, request.query.search)
            return reply.status(200).send(reposts)
        }catch(err){
            console.log(err)
            return reply.status(500).send({error: "Failed to list"})
        }
    }
    getReportById = async (request, reply) => {
        try{
            const reportData = await this.repository.getReportsDataById(request.params.id)
            if (!reportData){
                return reply.status(400).send({error: "Report not found"})
            }
            return reply.status(200).send(reportData)
        }catch(err){
            console.log(err)
            return reply.status(500).send({error: "Failed to get report"})
        }
    }

    getFinanceReportsData = async (request, reply) => {
        try{
            const data = await this.getFinanceData.filter(request.access_scope, request.userID, request.query.search, request.params.id)
            if (!data){
                return reply.status(404).send({error: "Failed to get finance report"})
            }
            return reply.status(200).send(data)
        } catch(err){
            console.log(err)
            return reply.status(500).send({error: "Failed to get finance report"})
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
