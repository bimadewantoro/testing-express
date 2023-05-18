const express = require('express');
const router = express.Router();
const file = require('../controllers/file.controller');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    }
});

const storageCsv = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/csv');
    }
});

const upload = multer({storage: storage});
const uploadCsv = multer({storage: storageCsv});

router.post('/', upload.single('file'), file.uploadFile);
router.post('/csv', uploadCsv.single('csv'), file.uploadCsvFile);

module.exports = router;