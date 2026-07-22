import fp from 'fastify-plugin'
// REPOSITORIES IMPORTS
import { RevenuesRepository } from '../Repositories/revenuesRepository.js'
import { ExpensesRepository } from '../Repositories/expensesRepository.js'
import { BranchesRepository } from '../Repositories/branchesRepository.js'
import { SectorsRepository } from '../Repositories/sectorsRepository.js'
import { CardsRepository } from "../Repositories/cardsRepository.js";
import { CompaniesRepository } from '../Repositories/companiesRepository.js'
import { MembersRepository } from "../Repositories/membersRepository.js";
import { ReportsRepository } from "../Repositories/reportsRepository.js";
import { RolesRepository } from "../Repositories/rolesRepository.js";
import { UsersRepository } from "../Repositories/usersRepository.js";

//  SERVICES IMPORTS
import { AuthService } from "./authService.js";
import { FilterService } from "./filterService.js";
import { GetUserInfos } from "./getUserInfos.js";
import { ScopeValidationService } from './scopeValidationService.js'
import { GetFinanceData } from "./getFinanceData.js";
import { ValidateBranchWriteAccess } from "./validateBranchWriteAccess.js";

//  CONTROLLERS IMPORTS
import { RevenuesController } from '../controllers/revenuesController.js'
import { ExpensesController } from '../controllers/expensesController.js'
import { BranchesController } from '../controllers/branchesController.js'
import { SectorsController } from '../controllers/sectorsController.js'
import { CardsController } from "../controllers/cardsController.js";
import { CompaniesController } from '../controllers/companiesController.js'
import { MembersController } from "../controllers/membersController.js";
import { ReportsController } from "../controllers/reportsController.js";
import { RolesController } from "../controllers/rolesController.js";
import { UsersController } from "../controllers/usersController.js";
import { DashBoardController } from "../controllers/dashBoardController.js";

async function containerPlugin(server, options) {
    // INSTANCE REPOSITORIES
    const repos = {
        revenues: new RevenuesRepository(),
        expenses: new ExpensesRepository(),
        branches: new BranchesRepository(),
        sectors: new SectorsRepository(),
        cards: new CardsRepository(),
        companies: new CompaniesRepository(),
        members: new MembersRepository(),
        reports: new ReportsRepository(),
        roles: new RolesRepository(),
        users: new UsersRepository(),
    }

    //  INSTANCE SERVICES
    const authService = new AuthService(repos.users)
    const validationService = new ScopeValidationService()
    const filterService = new FilterService(validationService)
    const getFinanceData = new GetFinanceData(repos.revenues, repos.expenses, validationService, repos.reports)
    const getUserInfos = new GetUserInfos(repos.users, repos.branches, repos.sectors)
    const branchesWriteValidation = new ValidateBranchWriteAccess(repos.branches)

    //  INSTANCE CONTROLLERS
    const controllers = {
        revenues: new RevenuesController(filterService, validationService, branchesWriteValidation, repos.revenues),
        expenses: new ExpensesController(validationService, filterService, branchesWriteValidation, repos.expenses),
        branches: new BranchesController(repos.branches, validationService),
        sectors: new SectorsController(repos.sectors),
        cards: new CardsController(repos.cards, validationService),
        companies: new CompaniesController(repos.companies),
        members: new MembersController(repos.members, validationService, branchesWriteValidation),
        reports: new ReportsController(repos.reports, validationService, getFinanceData),
        roles: new RolesController(repos.roles),
        users: new UsersController(authService, repos.users, getUserInfos),
        dashboard: new DashBoardController(getFinanceData),
    }


    server.decorate('repositories', repos)

    server.decorate('services', {
        authService,
        validationService,
        filterService,
        getFinanceData,
        getUserInfos
    })

    server.decorate('controllers', controllers)
}
export default fp(containerPlugin)