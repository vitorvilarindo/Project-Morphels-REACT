export class GetFinanceData {
    constructor(revenuesRepository, expensesRepository, validationService, reportsRepository) {
        this.revenuesRepository = revenuesRepository
        this.expensesRepository = expensesRepository
        this.validationService = validationService
        this.reportsRepository = reportsRepository

    }
    getData = async (access_scope, userId, search, dates) => {
        const revenues = await this.validationService.validateAccessScope(this.revenuesRepository, access_scope, userId, search, dates)
        const expenses = await this.validationService.validateAccessScope(this.expensesRepository, access_scope, userId, search, dates)

        return {
            revenues,
            expenses,
        }
    }

    filter = async (scope, userId, searchTerm, reportId, dates = null) => {
        if(reportId){
            dates = await this.reportsRepository.getReportsDataById(reportId)
        }

        console.log(dates)

        const {revenues, expenses} = await this.getData(scope, userId, searchTerm, dates[0]);

        return {
            filterRevenues: revenues,
            filterExpenses : expenses,
        }
    }
}

