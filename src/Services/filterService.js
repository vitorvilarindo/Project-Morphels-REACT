export class FilterService {
    constructor(validationService){
        this.validationService = validationService;
    }

    async filter(scope, userId, searchTerm, type, start_date, end_date) {
        const items = await this.validationService.validateAccessScope(scope, userId, searchTerm);

        if (!items || !Array.isArray(items)) {
            console.warn("Nenhum item encontrado ou erro na permissão.");
            return [];
        }

        return items.filter((item) => {
            const itemDate = new Date(item.date).getTime();
            const start = new Date(start_date).getTime();
            const end = new Date(end_date).getTime();

            const matchType = type ? item.type === type : true
            const matchStart = start_date ? itemDate >= start : true
            const matchEnd = end_date ? itemDate <= end : true

            return matchType && matchStart && matchEnd;
        })
    }

}