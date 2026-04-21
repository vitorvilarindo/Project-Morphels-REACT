import {
    createCard,
    listCards,
    editCard,
    deleteCard
} from "../controllers/cardsController.js"

export default async function cardsRoutes(server) {
    server.post("/cards", {preHandler: server.checkPermissions("can_add"), handler: createCard})
    server.get("/cards", {preHandler: server.checkPermissions("can_view"), handler: listCards})
    server.put("/cards/:id", {preHandler: server.checkPermissions("can_edit"), handler: editCard})
    server.delete("/cards/:id", {preHandler: server.checkPermissions("can_delete"), handler: deleteCard})
}