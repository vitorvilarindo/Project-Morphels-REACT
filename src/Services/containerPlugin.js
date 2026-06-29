import fp from 'fastify-plugin'
import { RevenuesRepository } from '../Repositories/revenuesRepository.js'
import { ExpensesRepository } from '../Repositories/expensesRepository.js'
import { BranchesRepository } from '../Repositories/branchesRepository.js'
import { SectorsRepository } from '../Repositories/sectorsRepository.js'

import { ScopeValidationService } from './scopeValidationService.js'

async function containerPlugin(server, options) {
    const revenuesRepository = new RevenuesRepository()
    const expensesRepository = new ExpensesRepository()
    const branchesRepository = new BranchesRepository()
    const sectorsRepository = new SectorsRepository()

    const validationService = new ScopeValidationService()


    server.decorate('repositories', {
        revenuesRepository,
        expensesRepository,
        branchesRepository,
        sectorsRepository,
    })

    server.decorate('services', {
        validationService
    })
}
export default fp(containerPlugin)