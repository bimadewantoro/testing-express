const db = require('../../config/db');

class Permission {
    constructor(data) {
        this.permission = data.permission;
    }

    async createPermission() {
        try {
            const queryText = 'INSERT INTO permissions (name) VALUES ($1) RETURNING *';
            const values = [this.permission];
            const { rows } = await db.query(queryText, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getPermission() {
        try {
            const queryText = 'SELECT * FROM permissions WHERE name = $1';
            const values = [this.permission];
            const {rows} = await db.query(queryText, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}