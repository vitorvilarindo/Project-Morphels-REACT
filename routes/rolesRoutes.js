import {
    createRole,
    listRoles,
    editRole,
    deleteRole
} from "../controllers/rolesController.js"

export default async function rolesRoutes(server) {
    server.post("/roles", createRole)
    server.get("/roles", listRoles)
    server.put("/roles/:id", editRole)
    server.delete("/roles/:id", deleteRole)
}
