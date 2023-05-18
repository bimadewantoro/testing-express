const db = require('../../config/db')

class UserRole {
  constructor (data) {
    this.role = data.role
    this.user = data.user
  }

  createUserRole () {
    const queryText = 'INSERT INTO user_roles (role_id, user_id) VALUES ($1, $2) RETURNING *'
    const values = [this.role, this.user]
    return db.query(queryText, values)
      .then(({ rows }) => rows[0])
  }

  getUserRole () {
    const queryText = 'SELECT * FROM user_role WHERE role_id = $1 AND user_id = $2'
    const values = [this.role, this.user]
    return db.query(queryText, values)
      .then(({ rows }) => rows[0])
  }
}

module.exports = UserRole
