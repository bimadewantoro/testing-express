const jwt = require('jsonwebtoken')

function verifyJWT () {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
          if (err) {
            return res.status(401).json({
              message: 'Invalid token'
            })
          }
          req.decodedToken = decodedToken
          next()
        })
      } else {
        next()
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = verifyJWT
