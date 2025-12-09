import {
    createCompany,
    listCompanies,
    editCompany,
    deleteCompany
} from "../controllers/companiesController.js"

export default async function companiesRoutes(server) {
    server.post("/companies", createCompany)
    server.get("/companies", listCompanies)
    server.put("/companies/:id", editCompany)
    server.delete("/companies/:id", deleteCompany)
}
