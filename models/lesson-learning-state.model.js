const db = require('../utils/db');
const TBL_LESSON_LS = 'lesson_learning_state'

module.exports = {

    getByLessonIdsAndUserId(lessonIds, userId) {
        return db(TBL_LESSON_LS)
            .whereIn('lesson_id', lessonIds)
            .andWhere('user_id', userId);
    },

    async isExist(userId, lessonId) {
        const items = await db(TBL_LESSON_LS).where({
            "user_id": userId,
            "lesson_id": lessonId,
        });
        return items.length > 0;
    },

    updateLearningTime(item) {
        return db(TBL_LESSON_LS)
            .where({
                "user_id": item.user_id,
                "lesson_id": item.lesson_id,
            })
            .update(
                {
                    "current_video_secconds": item.current_video_secconds,
                    "updated_at": item.updated_at,
                }
            )
    },

    add(item) {
        return db(TBL_LESSON_LS).insert(item);
    },
}