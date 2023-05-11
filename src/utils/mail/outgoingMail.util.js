const db = require('../../config/db');

const outGoingEmail = async (category, sender, recipienTo, subject, body, sentAt) => {
    try {
        const query = `INSERT INTO outgoing_emails (category, sender, recipient_to, subject, body, sent_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [category, sender, recipienTo, subject, body, sentAt];
        const { rows } = await db.query(query, values);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

module.exports = { outGoingEmail };