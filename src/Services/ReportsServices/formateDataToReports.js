class ReportsData {
    constructor(revenuesValidationService, expensesValidationService) {
        this.revenuesValidationService = revenuesValidationService
        this.expensesValidationService = expensesValidationService

    }
    async getData(access_scope, userId, search) {
        const revenues = await this.revenuesValidationService.validateAccessScope(access_scope, userId, search)
        const expenses = await this.expensesValidationService.validateAccessScope(access_scope, userId, search)

        return {
            revenues,
            expenses,
        }
    }

    async filter(scope, userId, searchTerm, start_date, end_date) {
        const {revenues, expenses} = await this.getData(scope, userId, searchTerm);

        if (!revenues || !Array.isArray(revenues)) {
            console.warn("Nenhum item encontrado ou erro na permissão.");
            return [];
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

