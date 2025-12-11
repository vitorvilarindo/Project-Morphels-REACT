import {
    createChurch,
    listChurchs,
    editChurch,
    deleteChurch
} from "../controllers/churchsController.js"

export default async function churchsRoutes(server) {
    server.post("/churchs", createChurch)
    server.get("/churchs", listChurchs)
    server.put("/churchs/:id", editChurch)
    server.delete("/churchs/:id", deleteChurch)
}
