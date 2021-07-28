module.exports = {
    "JWT_SECRET_KEY": process.env.JWT_SECRET_KEY,
    "JWT_EXPIRES_IN": Number(process.env.JWT_EXPIRES_IN),
    "OTP_EMAIL": process.env.OTP_EMAIL,
    "OTP_EMAIL_PASSWORD": process.env.OTP_EMAIL_PASSWORD,
}