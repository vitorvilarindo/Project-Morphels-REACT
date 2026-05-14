import {
    createCompany,
    listCompanies,
    editCompany,
    deleteCompany
} from "../controllers/companiesController.js"

export default async function companiesRoutes(server) {
    server.post("/companies", {preHandler: server.checkPermissions("can_add"),handler: createCompany})
    server.get("/companies", {preHandler: server.checkPermissions("can_view"),handler: listCompanies})
    server.put("/companies/:id", {preHandler: server.checkPermissions("can_edit"),handler: editCompany})
    server.delete("/companies/:id", {preHandler: server.checkPermissions("can_delete"),handler: deleteCompany})
}
