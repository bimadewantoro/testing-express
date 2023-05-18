const responseHelper = (res, status, message, data) => {
  const statusText = status >= 200 && status < 300 ? 'success' : 'failed' // Set statusText based on the status code

  res.status(status).json({
    status: statusText,
    message,
    data
  })
}

module.exports = responseHelper
