const fs = require('fs')
const mustache = require('mustache')
const transporter = require('../sendMail.util')
const { outGoingEmail, errorOutgoingEmail } = require('../outgoingMail.util')
require('dotenv').config()

module.exports = {
  async sendMailRegister (newUser, password) {
    const template = fs.readFileSync('./utils/mail/welcome/welcome.html', 'utf-8')

    const mail = {
      to: newUser.email,
      from: process.env.MAIL_FROM,
      subject: 'BTN EDC - Selamat Datang di BTN EDC',
      html: mustache.render(template, { newUser, password })
    }

    // Logging to outgoing_emails table
    try {
      await outGoingEmail('Signup', mail.from, mail.to, mail.subject, mail.html, new Date())
    } catch (err) {
      console.error(err)
    }

    transporter.sendMail(mail, (err, info) => {
      if (err) {
        console.log(err)
        errorOutgoingEmail('Signup', mail.from, mail.to, mail.subject, mail.html, new Date(9999, 12, 31))
      } else {
        console.log(info)
      }
    })
  }
}
