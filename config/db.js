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
    const client = await pool.connect()
    const start = Date.now()

    try {
      // Begin a transaction
      await client.query('BEGIN')

      const res = await client.query(text, params)
      const duration = Date.now() - start

      // Commit the transaction if the query was successful
      await client.query('COMMIT')

      console.log('executed query', { text, duration, rows: res.rowCount })
      return res
    } catch (error) {
      // Rollback the transaction if an error occurs
      await client.query('ROLLBACK')
      console.log('Error in query:', { text })
      throw error
    } finally {
      // Release the client back to the pool
      client.release()
    }
  }
}
