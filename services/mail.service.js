const env = require("../config/env");
const mailer = require("../utils/mailer")

module.exports = {
    async sendRegistationOTPEmail(user, otp) {
        const email = {
            from: env.OTP_EMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Udemy NNN Verification Code", // Subject line
            text: `Your Udemy NNN verification code is: ${otp.code}`, // plain text body
            html: `Your Udemy NNN verification code is:<br><h1>${otp.code}</h1>`, // html body
        };

        await mailer.sendEmail(email);
    }
}