const db = require('../utils/db');
const TBL_WATCH_LIST = "watch_list";
module.exports = {
    multiByUserId(userId) {
        return db(TBL_WATCH_LIST).where({
            "user_id": userId,
        })
    },

    add(item) {
        return db(TBL_WATCH_LIST).insert(item);
    },

    delete(item) {
        return db(TBL_WATCH_LIST)
            .where({
                "user_id": item.user_id,
                "course_id": item.course_id
            })
            .del();
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
