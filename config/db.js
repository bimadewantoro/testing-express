const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
})

module.exports = {
  async query (text, params) {
    const start = Date.now()
    try {
      const res = await pool.query(text, params)
      const duration = Date.now() - start
      console.log(
        'executed query',
        { text, duration, rows: res.rowCount }
      )
      return res
    } catch (error) {
      console.log('Error in query:', { text })
      throw error
    }
  }
}
