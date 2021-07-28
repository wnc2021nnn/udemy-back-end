const db = require('../utils/db');
const TBL_OTP = 'otps'

module.exports = {
    add(otp) {
        return db(TBL_OTP).insert(otp);
    },

    getByIdAndCode(id, code) {
        return db(TBL_OTP)
            .where({
                'id': id,
                'code': code,
            });
    },
    deleteByIdAndCode(id, code) {
        return db(TBL_OTP)
            .where({
                'id': id,
                'code': code,
            })
            .del();
    }
}