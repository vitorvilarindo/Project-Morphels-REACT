export class RevenuesController {
    constructor(filterService, validationService, revenuesRepository) {
        this._filterService = filterService;
        this._validationService = validationService;
        this._revenuesRepository = revenuesRepository;
    }

    create = async (request, reply) => {
        try{
            const createdRevenue = await this._revenuesRepository.create(request.body);
            if (!createdRevenue) {
                return reply.status(300).send({message: 'Revenue can not be crated'});
            }

            return reply.status(200).send({message: 'Revenue created successfully'});
        }catch(err){
            console.error(err);
            return reply.status(400).send({message: 'Revenue creation failed'});

        }

    }
    list = async (request, reply) => {
        try{
            const revenues = await this._validationService.validateAccessScope(request.access_scope, request.userID, request.query.search)

            if (!revenues) {
                return reply.status(200).send({message: 'Revenue does not exist'});
            }
            return reply.status(200).send(revenues)
        }catch(err){
            console.error(err);
            return reply.status(500).send({message: 'There is no revenues'});
        }

    }
    filter = async (request, reply) => {
        try {
            const {type, start_date, end_date} = request.body;

            const revenues = await this._filterService.filter(request.accessScope, request.userID, request.query.search, type, start_date, end_date);

            return reply.status(200).send(revenues)
        }catch(err){
            console.error(err);
            return reply.status(500).send({message: 'There is no revenue'});
        }
    }
    update = async (request, reply) => {
        try{
            const updateRevenue = await this._revenuesRepository.update(request.body);
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
            const deleteRevenue = await this._revenuesRepository.delete(request.params.id, request.userID);
            if (!deleteRevenue) {
                return reply.status(400).send({message: 'Revenue does not exist'});
            }
            return reply.status(200).send({message: 'Revenue deleted successfully'});
        }catch(err){
            console.error(err);
            return reply.status(500).send({message: 'There is no revenues'});
        }
    }

}