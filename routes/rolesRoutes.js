import {
    createRole,
    listRoles,
    editRole,
    deleteRole
} from "../controllers/rolesController.js"

export default async function rolesRoutes(server) {
    server.post("/roles", {preHandler: server.checkPermissions("can_add"),handler: createRole})
    server.get("/roles", {preHandler: server.checkPermissions("can_view"),handler: listRoles})
    server.put("/roles/:id", {preHandler: server.checkPermissions("can_edit"),handler: editRole})
    server.delete("/roles/:id", {preHandler: server.checkPermissions("can_delete"),handler: deleteRole})
}
