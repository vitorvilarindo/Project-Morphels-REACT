export default async function cardsRoutes(server) {
    const cardsController = server.controllers.cards

    server.post("/cards", {preHandler: server.checkPermissions("can_add"), handler: cardsController.create})
    server.get("/cards", {preHandler: server.checkPermissions("can_view"), handler: cardsController.list})
    server.put("/cards/:id", {preHandler: server.checkPermissions("can_edit"), handler: cardsController.update})
    server.delete("/cards/:id", {preHandler: server.checkPermissions("can_delete"), handler: cardsController.delete})
}