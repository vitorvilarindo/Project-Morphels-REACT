export class AuthService {
    constructor (revenuesRepository) {
        this._revenuesRepository = revenuesRepository;
    }

    async validateAccessScope(scope, userId, searchTerm) {
        if (scope === "local") {
            return await this._revenuesRepository.listAllWithLocalPermission(userId, searchTerm);
        }else if (scope === "sector") {
            return await this._revenuesRepository.listAllWithSectorPermission(userId, searchTerm);
        }else if (scope === "global") {
            return await this._revenuesRepository.listAllWithGlobalPermissions(userId, searchTerm);
        }
    }

    async filterRevenues (scope, userId, searchTerm, type, start_date, end_date) {
        const revenues = await this.validateAccessScope(scope, userId, searchTerm);

        if (!revenues || !Array.isArray(revenues)) {
            console.warn("Nenhum item encontrado ou erro na permissão.");
            return [];
        }

        return revenues.filter((item) => {
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