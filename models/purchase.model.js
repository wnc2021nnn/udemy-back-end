const db = require('../utils/db')

const TBL_PURCHASE = 'purchase';

module.exports = {
    add(purchase) {
        return db(TBL_PURCHASE).insert(purchase);
    },

    multiByUserIdAndType(userId, purchaseType = 'COURSE_PURCHASE') {
        return db(TBL_PURCHASE).where({
            'user_id': userId,
            'purchase_type': purchaseType,
        })
    },
}