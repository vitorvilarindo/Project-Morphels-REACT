import {
    createChurch,
    listChurchs,
    editChurch,
    deleteChurch
} from "../controllers/churchsController.js"

export default async function churchsRoutes(server) {
    server.post("/churchs", {preHandler: server.checkPermissions("can_add"),handler: createChurch})
    server.get("/churchs", {preHandler: server.checkPermissions("can_view"),handler: listChurchs})
    server.put("/churchs/:id", {preHandler: server.checkPermissions("can_edit"),handler: editChurch})
    server.delete("/churchs/:id", {preHandler: server.checkPermissions("can_delete"),handler: deleteChurch})
}
