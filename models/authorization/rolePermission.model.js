const db = require('../../config/db');

class RolePermission {
    constructor(data) {
        this.role = data.role;
        this.permission = data.permission;
    }

    async createRolePermission() {
        try {
            const queryText = 'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) RETURNING *';
            const values = [this.role, this.permission];
            const { rows } = await db.query(queryText, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}