import {
    createUser,
    login,
    profile,
    editUser,
    deleteUser, listUsers
} from "../controllers/usersController.js"


export default async function usersRoutes(server) {
    server.post("/users", createUser)
    server.get('/users', listUsers)
    server.post("/users/login", login)
    server.post("/users/profile", profile)
    server.put("/users/:id", editUser)
    server.delete("/users/:id", deleteUser)
}
