import { SumRevenues } from '../controllers/generalController.js'

export default async function generalRoutes(server) {
    server.get("/general/sum", SumRevenues)
}