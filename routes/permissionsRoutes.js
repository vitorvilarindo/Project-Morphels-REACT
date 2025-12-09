import {
    createPermission,
    listPermissions,
    editPermission,
    deletePermission
} from "../controllers/permissionsController.js"

export default async function permissionsRoutes(server) {
    server.post("/permissions", createPermission)
    server.get("/permissions", listPermissions)
    server.put("/permissions/:id", editPermission)
    server.delete("/permissions/:id", deletePermission)
}
