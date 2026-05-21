export class ValidationService {
    constructor(repository) {
        this._repository = repository;

        this._scopes = {
            local: this._repository.listAllWithLocalPermission.bind(this._repository),
            sector: this._repository.listAllWithSectorPermission.bind(this._repository),
            global: this._repository.listAllWithGlobalPermissions.bind(this._repository)
        };
    }

    async validateAccessScope(scope, userId, searchTerm) {
        const executeQuery = this._scopes[scope];

        if (!executeQuery) {
            throw new Error(`Escopo de acesso inválido ou não autorizado: ${scope}`);
        }
        return await executeQuery(userId, searchTerm);
    }
}