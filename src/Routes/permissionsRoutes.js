export default async function permissionsRoutes(server) {
    const permissionsController = server.controllers.permissions

    server.get("/permissions",permissionsController.listViewPermissions)
}