import {
    createRevenue,
    listRevenues,
    filterRevenues,
    editRevenue,
    deleteRevenue
} from "../controllers/revenuesController.js"

export default async function revenuesRoutes(server) {
    server.post("/revenues", createRevenue)
    server.get("/revenues", listRevenues)
    server.get("/revenues/filter", filterRevenues)
    server.put("/revenues/:id", editRevenue)
    server.delete("/revenues/:id", deleteRevenue)
}
