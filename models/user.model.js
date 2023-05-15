const db = require('../config/db');

class User {
    constructor(data) {
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.mobileNumber = data.mobileNumber;
    }

    async createUser() {
        try {
            const query = 'INSERT INTO users(username, email, password, mobile_number) VALUES($1, $2, $3, $4) RETURNING *';
            const values = [this.username, this.email, this.password, this.mobileNumber];
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}
module.exports = User;