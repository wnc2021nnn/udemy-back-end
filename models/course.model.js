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

    getDetailCouresById(courseId) {
        return db(TBL_COURSE).where({
            course_id: courseId
        });
    },

    getTopicIdsByCoursesIds(ids) {
        return db(TBL_COURSE).select('course_id', 'topic_id').whereIn('course_id', ids).groupBy('course_id', 'topic_id');
    },

    async increaseViewCountByOne(courseId) {
        const course = (await this.getDetailCouresById(courseId))[0];
        if (course) {
            const viewCount = course.view_count + 1;
            const result = await db(TBL_COURSE).where({ course_id: courseId })
                .update({ view_count: viewCount }
                    , ['course_id', 'view_count']
                );
            return result;
        }
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