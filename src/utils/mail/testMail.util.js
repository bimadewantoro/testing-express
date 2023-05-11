const nodemailer = require('nodemailer');
require('dotenv').config();

async function main() {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: 'Hello !',
        text: 'Welcome to our app !',
        html: '<b>Welcome to our app !</b>',
    });

    console.log('Message sent: %s', info.messageId);
}

main().catch(console.error);