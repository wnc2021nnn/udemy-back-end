const { v4 } = require("uuid");
const otpModel = require("../models/otp.model");

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
    }
}