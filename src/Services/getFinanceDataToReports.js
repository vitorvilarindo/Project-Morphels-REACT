export class GetFinanceDataToReports {
    constructor(revenuesRepository, expensesRepository, validationService, reportsRepository) {
        this.revenuesRepository = revenuesRepository
        this.expensesRepository = expensesRepository
        this.validationService = validationService
        this.reportsRepository = reportsRepository

    }
    async getData(access_scope, userId, search) {
        const revenues = await this.validationService.validateAccessScope(this.revenuesRepository, access_scope, userId, search)
        const expenses = await this.validationService.validateAccessScope(this.expensesRepository, access_scope, userId, search)

        return {
            revenues,
            expenses,
        }
    }

    async filter(scope, userId, searchTerm, reportId) {
        const {revenues, expenses} = await this.getData(scope, userId, searchTerm);
        const { start_date, end_date } = await this.reportsRepository.getReportsDataById(reportId)

        if (!revenues || !Array.isArray(revenues)) {
            console.warn("Nenhum item encontrado ou erro na permissão.");
        }

        const filterRevenues = revenues.filter((revenues) => {
            const itemDate = new Date(revenues.date).getTime();
            const start = new Date(start_date).getTime();
            const end = new Date(end_date).getTime();

            const matchStart = start_date ? itemDate >= start : true
            const matchEnd = end_date ? itemDate <= end : true

            return matchStart && matchEnd;
        })

        const filterExpenses = expenses.filter((expenses) => {
            const itemDate = new Date(expenses.date).getTime();
            const start = new Date(start_date).getTime();
            const end = new Date(end_date).getTime();

            const matchStart = start_date ? itemDate >= start : true
            const matchEnd = end_date ? itemDate <= end : true

            return matchStart && matchEnd;
        })
        return {
            filterRevenues,
            filterExpenses
        }
    }
}

