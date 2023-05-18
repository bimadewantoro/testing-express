const db = require('../../config/db')

class RolePermission {
  constructor (data) {
    this.role = data.role
    this.permission = data.permission
  }

  createRolePermission () {
    const queryText = 'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) RETURNING *'
    const values = [this.role, this.permission]
    return db.query(queryText, values)
      .then(({ rows }) => rows[0])
  }
}

module.exports = RolePermission
