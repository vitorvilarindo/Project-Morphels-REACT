export class ReportsInfos {
    constructor(userRepository, branchesRepository, sectorsRepository) {
        this.userRepository = userRepository
        this.branchesRepository = branchesRepository
        this.sectorsRepository = sectorsRepository
    }

    async getData(userId){
        const user = await this.userRepository.findUserById(userId)
        const branch = await this.branchesRepository.findBranchById(user.branch)
        const sector = await this.sectorsRepository.findSectorById(user.sector)

        return{
            username: user.name,
            branch: branch.name,
            branch_owner: branch.branch_owner,
            sector: sector.name,
            sector_coordinator: sector.sectorial_cordenator
        }

    }
}