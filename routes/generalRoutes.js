import { SumRevenues, getPermissions } from '../controllers/generalController.js'

export default async function generalRoutes(server) {
    server.get("/general/sum", {preHandler: server.checkPermissions("can_view"),handler: SumRevenues})
    server.get("/general/permissions", getPermissions)
}