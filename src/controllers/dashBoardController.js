export class DashBoardController {
    constructor(getFinanceData) {
        this.getFinanceData = getFinanceData;
    }

    get = async (request, reply) => {
        try{
            const financeData = await this.getFinanceData.getData(request.access_scope, request.userID, request.params.search, request.body);
            if (!financeData) {
                return reply.status(303)
            }
            console.log(financeData);
            return reply.status(203).send({
                revenues: financeData.revenues[0]?.revenues_sum,
                expenses: financeData.expenses[0]?.expenses_sum,
            }) ;
        }catch(e){
            console.log(e)
            return reply.status(500)
        }
    }
}