import { createMember, listMembers, editMember, deleteMember } from '../controllers/membersController.js'

export default async function revenuesRoutes(server) {
    server.post("/members", {preHandler: server.checkPermissions("can_add"),handler: createMember})
    server.get("/members", {preHandler: server.checkPermissions("can_view"),handler: listMembers})
    // server.get("/members/filter", filterRevenues)
    server.put("/members/:id", {preHandler: server.checkPermissions("can_edit"),handler: editMember})
    server.delete("/members/:id", {preHandler: server.checkPermissions("can_delete"),handler: deleteMember})
}
