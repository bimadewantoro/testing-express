'use strict';

const fs = require('fs');
const ftp = require('basic-ftp');
const { Base64Transform } = require('base64-stream');
const env = require('dotenv').config();

const client = new ftp.Client();
// Activate Debugging
client.ftp.verbose = true;

module.exports = {
    async ftpClient() {
        try {
            await client.access({
                host: process.env.FTP_HOST,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD,
                secure: false,
            });
            // List the files in the current directory
            console.log(await client.list());
        }
        catch(err) {
            console.log(err);
        }
        client.close();
    }
}