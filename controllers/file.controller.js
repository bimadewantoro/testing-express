const fs = require('fs')
const csv = require('fast-csv')
const ftpClient = require('../config/ftp')
const responseStatus = require('./helpers/response.helper')
const db = require('../config/db')

/**
 * Upload file to FTP server
 *
 * @param req
 * @param res
 */
exports.uploadFile = async (req, res) => {
  try {
    const client = await ftpClient.createFTPClient()

    // List the files in the current directory
    console.log(await client.list())

    // Remote folder to upload file
    const remotePath = `/uploads/${req.file.originalname}`

    // Upload a file
    await client.uploadFrom(req.file.path, remotePath)
    client.close()

    responseStatus(res, 200, 'File uploaded successfully', req.file, false)
  } catch (error) {
    responseStatus(res, 500, error.message, null, true)
  }
}

/**
 * Upload CSV file to FTP server
 *
 * @param req
 * @param res
 */
exports.uploadCsvFile = async (req, res) => {
  try {
    const client = await ftpClient.createFTPClient()
    // List the files in the current directory
    console.log(await client.list())
    // Remote folder to upload file
    const remotePath = `/uploads/csv/${req.file.originalname}`
    // Define an array of allowed file types
    const allowedFileTypes = ['text/csv', 'application/vnd.ms-excel']
    // Validate file type
    if (!allowedFileTypes.includes(req.file.mimetype)) {
      responseStatus(res, true, 'File type must be CSV', null, true)
    } else {
      // Import CSV file to database
      const filePath = req.file.path
      const csvData = []
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', (error) => {
          responseStatus(res, 400, error.message, null, true)
        })
        .on('data', (row) => {
          csvData.push(row)
        })
        .on('end', async () => {
          try {
            // Insert data into the PostgresSQL database
            const query = 'INSERT INTO merchants (merchant_name, merchant_description, merchant_city, merchant_postalcode) VALUES ($1, $2, $3, $4)'
            const emptyRows = []
            const existingData = []
            for (const row of csvData) {
              // Check if any field is empty in the row
              if (!row.merchant_name || !row.merchant_description || !row.merchant_city || !row.merchant_postalcode) {
                // Add the row to emptyRows array
                emptyRows.push(row)
                continue // Skip this row and move to the next iteration
              }

              // Check if the row already exists in the database
              const queryCheckExisting = 'SELECT * FROM merchants WHERE merchant_name = $1 AND merchant_description = $2 AND merchant_city = $3 AND merchant_postalcode = $4'
              const { rows: existingRows } = await db.query(queryCheckExisting, [
                row.merchant_name,
                row.merchant_description,
                row.merchant_city,
                row.merchant_postalcode
              ])

              if (existingRows.length === 0) {
                // Insert the row into the database
                await db.query(query, [
                  row.merchant_name,
                  row.merchant_description,
                  row.merchant_city,
                  row.merchant_postalcode
                ])
              } else {
                // Row already exists, add it to existingData array
                existingData.push(row)
              }
            }

            // Validate postal code format
            const queryInvalidPostalCode = "SELECT * FROM merchants WHERE merchant_postalcode !~ '^[0-9]{5}$'"
            const { rows: invalidPostalCode } = await db.query(queryInvalidPostalCode)

            // Delete rows with invalid postal codes
            if (invalidPostalCode.length > 0) {
              const queryDeleteInvalidPostalCode = "DELETE FROM merchants WHERE merchant_postalcode !~ '^[0-9]{5}$'"
              await db.query(queryDeleteInvalidPostalCode)
            }

            // Get all rows from the database
            const getAllRows = 'SELECT * FROM merchants'
            const { rows: success } = await db.query(getAllRows)

            responseStatus(res, 200, 'File uploaded successfully', { success, failed: { emptyRows, invalidPostalCode, existingData } }, false)
          } catch (error) {
            responseStatus(res, 500, error.message, null, true)
          }
        })
      // Upload the file to FTP server
      client.uploadFrom(req.file.path, remotePath)
        .then(() => {
          client.close()
        })
        .catch((error) => {
          responseStatus(res, 500, error.message, null, true)
        })
    }
  } catch (error) {
    responseStatus(res, 500, error.message, null, true)
  }
}
