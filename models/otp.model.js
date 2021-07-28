const db = require('../utils/db');
const TBL_OTP = 'otps'

module.exports = {
    add(otp) {
        return db(TBL_OTP).insert(otp);
    },
}