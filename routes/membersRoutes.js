import { createMember, listMembers, editMember, deleteMember } from '../controllers/membersController.js'

export default async function revenuesRoutes(server) {
    server.post("/members", createMember)
    server.get("/members", listMembers)
    // server.get("/members/filter", filterRevenues)
    server.put("/members/:id", editMember)
    server.delete("/members/:id", deleteMember)
}
