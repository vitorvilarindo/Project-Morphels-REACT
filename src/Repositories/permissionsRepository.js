import { sql } from "../../db.js";

export class PermissionsRepository {
    async listPagesViewPermissions(userId) {
        return sql`
            SELECT
                p.can_view,
                pg.name AS page_name
            FROM permissions p
                     JOIN roles r ON p.role_id = r.id
                     JOIN users u ON r.id = u.designation
                     LEFT JOIN pages pg ON p.page_id = pg.id
            WHERE u.id = ${userId}
        `
    }
}