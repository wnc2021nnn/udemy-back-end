const db = require('../utils/db');
const TBL_WATCH_LIST = "watch_list";
module.exports = {
    multiByUserId(userId){
        return db(TBL_WATCH_LIST).where({
            "user_id": userId,
        })
    },

    add(item) {
        return db(TBL_WATCH_LIST).insert(item);
    },

    async isItemExist(userId, courseId) {
        const items = await db(TBL_WATCH_LIST).where({
            "user_id": userId,
            "course_id": courseId,
        });
        if (items.length > 0) {
            return true;
        } else {
            return false;
        }
    }
};
