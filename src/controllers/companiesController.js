export class CompaniesController {
    constructor(companiesRepository) {
        this.companiesRepository = companiesRepository
    }
    create = async function (request, reply) {
        try{
            const companyCreate = await this.companiesRepository.createCompany(request.body, request.userID)
            if(!companyCreate){
                return reply.status(303).send({message: "The company could not be created."})
            }
            return reply.status(200).send({message: "Company created successfully."})
        }catch(err){
            console.log(err)
            return reply.status(500).send({message: "Error creating companies."})
        }
    }
    list = async function (request, reply) {
        try{
            const companies = await this.companiesRepository.listCompanies(request.userID)
            if(!companies){
                return reply.status(400).send({message: "No company found."})
            }
            return reply.status(200).send(companies)
        }catch(err){
            console.log(err)
            return reply.status(500).send({message: "Error listing companies."})
        }
    }
    update = async function (request, reply) {
        try{
            const companyUpdate = await this.companiesRepository.updateCompany(request.body, request.params.id)
            if(!companyUpdate){
                return reply.status(404).send({message: "No company found."})
            }
            return reply.status(200).send({message: "Company updated successfully."})
        }catch(err){
            console.log(err)
            return reply.status(500).send({message: "Error updating companies."})
        }
    }
    delete = async function (request, reply) {
        try{
            const companyDeleted = await this.companiesRepository.deleteCompany(request.params.id)
            if(!companyDeleted){
                return reply.status(404).send({message: "No company found."})
            }
            return reply.status(200).send({message: "Company deleted successfully."})
        }catch(err){
            console.log(err)
            return reply.status(500).send({message: "Error deleting companies."})
        }
    }
}