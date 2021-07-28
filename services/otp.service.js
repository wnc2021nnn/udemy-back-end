const { v4 } = require("uuid");
const otpModel = require("../models/otp.model");
const userModel = require("../models/user.model");
const mailService = require("./mail.service");

module.exports = {
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    },

    async createOtp() {
        const otp = {
            id: v4(),
            code: this.getRandomInt(100000, 1000000),
            created_at: Date.now(),
        }
        await otpModel.add(otp);

        return otp;
    },

    async verifyOtp(user, otp) {
        const otps = await otpModel.getByIdAndCode(otp.id, otp.code);
        if (otps.length < 1) {
            throw false;
        }
        await otpModel.deleteByIdAndCode(otp.id, otp.code);

        await userModel.patchUser(user.user_id, {
            'email_verified': true,
        })

        return true;
    },

    async resendOtp(user) {
        const dbUser = await userModel.single(user.user_id);

        const otp = await this.createOtp();

        await mailService.sendRegistationOTPEmail(dbUser, otp);

        delete otp.code;
        
        return otp;
    }
}