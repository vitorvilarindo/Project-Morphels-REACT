export class RevenuesController {
    constructor(filterService, validationService, branchesValidationService, revenuesRepository) {
        this._filterService = filterService;
        this._validationService = validationService;
        this._revenuesRepository = revenuesRepository;
        this._branchesValidationService = branchesValidationService;
    }

    create = async (request, reply) => {
        try{
            await this._branchesValidationService.validateAccess(request.access_scope, request.userID, request.userBranch, request.body.branch);
            const createdRevenue = await this._revenuesRepository.createRevenue(request.body);
            if (!createdRevenue) {
                return reply.status(300).send({message: 'Revenue can not be crated'});
            }

            return reply.status(200).send({message: 'Revenue created successfully'});
        }catch(error){
            if (error.statusCode){
                return reply.status(error.statusCode).json({ error: error.message });
            }
            console.error(error);
            return reply.status(400).send({message: 'Revenue creation failed'});
        }

    }
    list = async (request, reply) => {
        try{
            const revenues = await this._validationService.validateAccessScope(this._revenuesRepository, request.access_scope, request.userID)

            if (revenues.length === 0) {
                return reply.status(404).send({message: 'Revenue does not exist'});
            }
            return reply.status(200).send(revenues)
        }catch(err){
            console.error(err);
            return reply.status(500).send({message: 'There is no revenues'});
        }

    }

    listWithDates = async (request, reply) => {
        try{
            const revenues = await this._validationService.validateAccessScope(this._revenuesRepository, request.access_scope, request.userID, request.query.search, request.params)

            if (revenues.length === 0) {
                return reply.status(404).send({message: 'Revenue does not exist'});
            }
            return reply.status(200).send(revenues)
        }catch(err){
            console.error(err);
            return reply.status(500).send({message: 'There is no revenues'});
        }

    }

    update = async (request, reply) => {
        try{
            const updateRevenue = await this._revenuesRepository.updateRevenue(request.body, request.params.id, request.userID);
            if (!updateRevenue) {
                return reply.status(400).send({message: 'Revenue does not exist'});
            }
            return reply.status(200).send({message: 'Revenue updated successfully'});
        }catch(err){
            console.error(err);
            return reply.status(500).send({message: 'There is no revenues'});
        }
    }
    delete = async (request, reply) => {
        try {
            const deleteRevenue = await this._revenuesRepository.deleteRevenue(request.params.id, request.userID);
            if (deleteRevenue.length === 0) {
                return reply.status(404).send({message: 'Revenue does not exist'});
            }
            return reply.status(200).send({message: 'Revenue deleted successfully'});
        }catch(err){
            console.error(err);
            return reply.status(503).send({message: 'There is no revenues'});
        }
    }

}