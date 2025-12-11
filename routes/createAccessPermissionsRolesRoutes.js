import {createAccessPermissionRole, getPermissionsRolesHandle} from "../controllers/createAccessPemissionsRoles.js";

export default async function accessPermissionsRolesRoutes(server) {
    server.get('/permissions_roles', getPermissionsRolesHandle)
    server.post('/permissions_roles', createAccessPermissionRole)
};