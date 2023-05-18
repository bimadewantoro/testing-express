const db = require('../../config/db')

class Permission {
  constructor (data) {
    this.permission = data.permission
  }

  createPermission () {
    const queryText = 'INSERT INTO permissions (name) VALUES ($1) RETURNING *'
    const values = [this.permission]
    return db.query(queryText, values)
      .then(({ rows }) => rows[0])
  }

  getPermission () {
    const queryText = 'SELECT * FROM permissions WHERE name = $1'
    const values = [this.permission]
    return db.query(queryText, values)
      .then(({ rows }) => rows[0])
  }
}

module.exports = Permission
