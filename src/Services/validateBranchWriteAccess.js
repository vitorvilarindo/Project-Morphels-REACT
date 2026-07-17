export class ValidateBranchWriteAccess {
    constructor(branchesRepository) {
        this.branchesRepository = branchesRepository;
    }
    validateAccess = async  (access_scope, userId, userBranch, targetBranch) => {

        if (access_scope === "global"){
            return true
        }

        if (access_scope === "local"){
            if(String(userBranch) !== String(targetBranch)){
                const error = new Error('Você só tem permissão para registrar dados na sua própria filial.');
                error.statusCode = 403;
                throw error;
            }
            return true;
        }

        if (access_scope === "sector"){
            const userBranchSectorId = await this.branchesRepository.findBranchById(userBranch);
            const targetBranchSectorId = await this.branchesRepository.findBranchById(targetBranch);

            if (targetBranchSectorId.length === 0){
                const error = new Error('A filial informada não existe.');
                error.statusCode = 403;
                throw error;
            }

            if (String(userBranchSectorId) !== String(targetBranchSectorId)){
                const error = new Error('Você só pode registrar dados em filiais do seu próprio setor.');
                error.statusCode = 403;
                throw error;
            }
            return true
        }
    }
}