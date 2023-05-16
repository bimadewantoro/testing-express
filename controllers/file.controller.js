const ftp = require('basic-ftp');
const fs = require('fs');
const responseStatus = require('./helpers/response.helper');

/**
 * Upload file to FTP server
 *
 * @param req
 * @param res
 */
exports.uploadFile = async (req, res) => {
    try {
        const client = new ftp.Client();
        client.ftp.verbose = true;
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false,
        });

        // List the files in the current directory
        console.log(await client.list());

        // Remote folder to upload file
        const remotePath = '/uploads/' + req.file.originalname;

        // Upload a file
        await client.uploadFrom(req.file.path, remotePath);
        await client.close();
        responseStatus(res, 200, 'File uploaded successfully', null, true);
    } catch (error) {
        responseStatus(res, 500, error.message, null, true);
    }
};