var nodemailer = require('nodemailer');
const env = require('../config/env');

module.exports = {
    async sendEmail(email) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        //let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        const userMail = env.OTP_EMAIL;
        const userPass = env.OTP_EMAIL_PASSWORD;

        //var transporter = nodemailer.createTransport(`smtp://wnc2021nnn%40outlook.com:wnc2021pass@smtp-mail.outlook.com`);
        let transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            auth: {
                user: userMail,
                pass: userPass,
            }

        });
        //console.log(testAccount);

        // send mail with defined transport object
        let info = await transporter.sendMail(email);

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
}