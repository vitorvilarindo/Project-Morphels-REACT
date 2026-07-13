export class DashBoardController {
    constructor(getFinanceData) {
        this.getFinanceData = getFinanceData;
    }

    get = async (request, reply) => {
        try{
            const financeData = await this.getFinanceData.getData(request.access_scope, request.userId, request.params.search, request.body);
            if (!financeData) {
                return reply.status(303)
            }
            return reply.status(203).send(financeData) ;
        }catch(e){
            console.log(e)
            return reply.status(500)
        }
    }
}