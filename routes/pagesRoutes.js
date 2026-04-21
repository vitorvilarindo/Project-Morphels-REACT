import {
    createPage,
    listPages,
    editPage,
    deletePage
} from "../controllers/pagesController.js"

export default async function pagesRoutes(server) {
    server.post("/pages", {preHandler: server.checkPermissions("can_add"), handler: createPage})
    server.get("/pages", {preHandler: server.checkPermissions("can_view"), handler: listPages})
    server.put("/pages/:id", {preHandler: server.checkPermissions("can_edit"), handler: editPage})
    server.delete("/pages/:id", {preHandler: server.checkPermissions("can_delete"), handler: deletePage})
}