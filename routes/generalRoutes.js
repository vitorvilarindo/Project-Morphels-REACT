import { SumRevenues, getPermissions } from '../controllers/generalController.js'

export default async function generalRoutes(server) {
    server.get("/general/sum", SumRevenues)
    server.get("/general/permissions", getPermissions)
}