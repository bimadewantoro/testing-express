const express = require('express')

const router = express.Router()
const multer = require('multer')
const file = require('../controllers/file.controller')

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, './public/uploads/')
  }
})

const storageCsv = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, './public/uploads/csv')
  }
})

const upload = multer({ storage })
const uploadCsv = multer({ storage: storageCsv })

router.post('/', upload.single('file'), file.uploadFile)
router.post('/csv', uploadCsv.single('csv'), file.uploadCsvFile)

module.exports = router
