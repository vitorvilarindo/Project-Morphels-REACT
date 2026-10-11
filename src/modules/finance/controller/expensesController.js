export class ExpensesController {
    constructor(scopeValidationService, filterService, branchesValidationService, expensesRepository) {
        this._scopeValidationService = scopeValidationService;
        this._filterService = filterService;
        this._expensesRepository = expensesRepository;
        this._branchesValidationService = branchesValidationService
    }
    create = async (request, reply) => {
        try {
            await this._branchesValidationService.validateAccess(request.access_scope, request.userID, request.userBranch, request.body.branch)
            const createdExpense = await this._expensesRepository.createExpenses(request.body);

            if (createdExpense.length === 0) {
                return reply.status(300).send({message: 'There can not create any expense'});
            }
            return reply.status(201).send({message: 'Successfully created expense'});
        }catch(err){
            if (err.statusCode){
                return reply.status(err.statusCode).send({error: err.message});
            }
            console.error(err);
            return reply.status(400).send({message: 'Something went wrong'});

        }
    }
    list = async (request, reply) => {
        try{
            const expenses = await this._scopeValidationService.validateAccessScope(this._expensesRepository, request.access_scope, request.userID)
            if (expenses.length === 0) {
                return reply.status(200).send(null);
            }
            return reply.status(200).send(expenses);
        } catch (err){
            console.log(err)
            return reply.status(400).send({message: 'Something went wrong'});
        }
    }

    listWithDates = async (request, reply) => {
        try{
            const expenses = await this._scopeValidationService.validateAccessScope(this._expensesRepository, request.access_scope, request.userID, request.query.search, request.params)
            if (expenses.length === 0) {
                return reply.status(200).send({message: 'There can not list expenses'});
            }
            return reply.status(200).send(expenses);
        } catch (err){
            console.log(err)
            return reply.status(400).send({message: 'Something went wrong'});
        }
    }

    update = async (request, reply) => {
        try{
            const updateExpense = await this._expensesRepository.updateExpenses(request.body, request.params.id);
            if (updateExpense.length === 0) {
                return reply.status(400).send({message: 'Expenses not found'});
            }
            return reply.status(200).send({message: 'Successfully updated expense'});
        }catch(err){
            console.log(err)
            return reply.status(500).send({message: 'Something went wrong'});
        }
    }
    delete = async (request, reply) => {
        try{
            const deleteExpense = await this._expensesRepository.deleteExpenses(request.params.id, request.userID);
            if (deleteExpense.length === 0){
                return reply.status(400).send({message: 'Expenses not found'});
            }
            return reply.status(200).send({message: 'Successfully deleted expense'});
        }catch(err){
            console.log(err)
            return reply.status(500).send({message: 'Something went wrong'});
        }
    }
}