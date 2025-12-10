import { getPermissionsRolesHandle } from "../controllers/createAccessPemissionsRoles.js";

export default async function accessPermissionsRolesRoutes(server) {
    server.get('/permissions_roles', getPermissionsRolesHandle)
};