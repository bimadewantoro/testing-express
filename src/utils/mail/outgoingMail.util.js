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

const errorOutgoingEmail = async (category, sender, recipientTo, subject, body, sentAt) => {
    try {
        const query = 'UPDATE outgoing_emails SET category = $1, sender = $2, recipient_to = $3, subject = $4, body = $5, sent_at = $6 WHERE recipient_to = $3';
        const values = [category, sender, recipientTo, subject, body, sentAt];
        const { rows } = await db.query(query, values);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

module.exports = { outGoingEmail, errorOutgoingEmail };