export class ScopeValidationService {
    async validateAccessScope(repository, scope, userId, searchTerm) {

        const scopes = {
            local: repository.listAllWithLocalPermission,
            sector: repository.listAllWithSectorPermission,
            global: repository.listAllWithGlobalPermissions
        };
        const executeQuery = scopes[scope];

        if (!executeQuery) {
            throw new Error(`Escopo de acesso inválido ou não autorizado: ${scope}`);
        }
        return await executeQuery(userId, searchTerm);
    }
}