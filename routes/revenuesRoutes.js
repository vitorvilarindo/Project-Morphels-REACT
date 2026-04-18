import {
    createRevenue,
    listRevenues,
    filterRevenues,
    editRevenue,
    deleteRevenue
} from "../controllers/revenuesController.js"

export default async function revenuesRoutes(server) {
    server.post("/revenues", {preHandler: server.checkPermissions("manage_data"), handler:createRevenue})
    server.get("/revenues", listRevenues)
    server.get("/revenues/filter", filterRevenues)
    server.put("/revenues/:id", {preHandler:server.checkPermissions("manage_data"),handler:editRevenue})
    server.delete("/revenues/:id", {preHandler:server.checkPermissions("manage_data"),handler:deleteRevenue})
}
