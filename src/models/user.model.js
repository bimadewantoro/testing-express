const db = require('../config/db');

class User {
    constructor(data) {
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
    }

    async createUser() {
        try {
            const queryText = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
            const values = [this.username, this.email, this.password];
            const { rows } = await db.query(queryText, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}
module.exports = User;