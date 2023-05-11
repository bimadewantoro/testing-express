const db = require('../../config/db');

class Role {
    constructor(data) {
        this.role = data.role;
    }
    async createRole() {
        try {
            const queryText = 'INSERT INTO roles (name) VALUES ($1) RETURNING *';
            const values = [this.role];
            const { rows } = await db.query(queryText, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getRole() {
        try {
            const queryText = 'SELECT * FROM roles WHERE name = $1';
            const values = [this.role];
            const { rows } = await db.query(queryText, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Role;