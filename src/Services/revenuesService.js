import {RevenuesRepository} from "../Repositories/revenuesRepository.js";

export class AuthService {
    constructor (revenuesService) {
        this._revenuesRepository = new RevenuesRepository();
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
}