const db = require('../utils/db');
const TBL_COURSE = 'course'

module.exports = {
    getAll() {
        return db(TBL_COURSE);
    },

    getCourseByTopic(topicId) {
        return db(TBL_COURSE).where({
            topic_id: topicId
        });
    },

    getTopRegistedCoursesByTopic(topicId, limit = 6) {
        return db(TBL_COURSE).where({
            topic_id: topicId
        }).orderBy('registed_count', 'desc').limit(limit);
    },

    getDetailCouresById(courseId) {
        return db(TBL_COURSE).where({
            course_id: courseId
        });
    },

    getCouresByIds(courseIds) {
        return db(TBL_COURSE).whereIn(
            'course_id', courseIds
        );
    },

    getTopicIdsByCoursesIds(ids) {
        return db(TBL_COURSE).select('course_id', 'topic_id').whereIn('course_id', ids).groupBy('course_id', 'topic_id');
    },

    updateViewCount(courseId, viewCount) {
        return db(TBL_COURSE).where({ course_id: courseId })
            .update({ view_count: viewCount }
                , ['course_id', 'view_count']
            );
    },

    updateRegistedCount(courseId, registedCount) {
        return db(TBL_COURSE).where({ course_id: courseId })
            .update({ registed_count: registedCount }
                , ['course_id', 'registed_count']
            );
    },

    update(courseId, createdAt) {
        return db(TBL_COURSE).where({ course_id: courseId })
            .update({ created_at: createdAt }
                , ['course_id', 'created_at']
            );
    },

    updateUpdatedAt(courseId, updatedAt) {
        return db(TBL_COURSE).where({ course_id: courseId })
            .update({ updated_at: updatedAt }
                , ['course_id', 'updated_at']
            );
    },

    async searchCourse(query) {
        return db(TBL_COURSE).where('title', 'like', `%${query}%`);
    }
}

    // .select(
    //     [
    //         `${TBL_COURSE}.*`,
    //         'user.user_id as lecturer_id',
    //         'user.first_name as lecturer_first_name',
    //         'user.last_name as lecturer_last_name',
    //     ]
    // )

    // .leftJoin('user', 'course.lecturers_id', 'user.user_id')