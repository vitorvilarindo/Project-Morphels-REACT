import {
    createRevenue,
    listRevenues,
    filterRevenues,
    editRevenue,
    deleteRevenue
} from "../controllers/revenuesController.js"

export default async function revenuesRoutes(server) {
    server.post("/revenues", {preHandler: server.checkPermissions("insert_data"), handler:createRevenue})
    server.get("/revenues", listRevenues)
    server.get("/revenues/filter", filterRevenues)
    server.put("/revenues/:id", {preHandler:server.checkPermissions("update_data"),handler:editRevenue})
    server.delete("/revenues/:id", {preHandler:server.checkPermissions("delete_data"),handler:deleteRevenue})
}
