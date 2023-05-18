const db = require('../config/db')

class User {
  constructor (data) {
    this.username = data.username
    this.email = data.email
    this.password = data.password
    this.mobileNumber = data.mobileNumber
  }

  createUser () {
    const query = 'INSERT INTO users(username, email, password, mobile_number) VALUES($1, $2, $3, $4) RETURNING *'
    const values = [this.username, this.email, this.password, this.mobileNumber]
    return db.query(query, values)
      .then(({ rows }) => rows[0])
  }
}

module.exports = User
