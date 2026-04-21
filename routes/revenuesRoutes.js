import {
    createRevenue,
    listRevenues,
    filterRevenues,
    editRevenue,
    deleteRevenue
} from "../controllers/revenuesController.js"

export default async function revenuesRoutes(server) {
    server.post("/revenues", {preHandler: server.checkPermissions("can_add"),handler: createRevenue})
    server.get("/revenues", {preHandler: server.checkPermissions("can_view"),handler: listRevenues})
    server.get("/revenues/filter", {preHandler: server.checkPermissions("can_view"),handler: filterRevenues})
    server.put("/revenues/:id", {preHandler: server.checkPermissions("can_edit"),handler: editRevenue})
    server.delete("/revenues/:id", {preHandler: server.checkPermissions("can_delete"),handler: deleteRevenue})
}
