const ftp = require('basic-ftp')

// Create FTP client function
const createFTPClient = async () => {
  const client = new ftp.Client()
  client.ftp.verbose = true
  await client.access({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: false
  })
  return client
}

module.exports = { createFTPClient }
