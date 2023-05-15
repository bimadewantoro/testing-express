const db = require('../../config/db');

class UserRole {
    constructor(data) {
        this.role = data.role;
        this.user = data.user;
    }

    async createUserRole() {
        try {
            const queryText = 'INSERT INTO user_roles (role_id, user_id) VALUES ($1, $2) RETURNING *';
            const values = [this.role, this.user];
            const { rows } = await db.query(queryText, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getUserRole() {
        try {
            const queryText = 'SELECT * FROM user_role WHERE role_id = $1 AND user_id = $2';
            const values = [this.role, this.user];
            const {rows} = await db.query(queryText, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}