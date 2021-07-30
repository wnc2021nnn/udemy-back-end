const db = require('../utils/db');
const TBL_COURSE = 'course'

module.exports = {
    courseByTeacher(teacherId, courseId) {
        return db(TBL_COURSE).where({
            course_id: courseId,
            lecturers_id: teacherId,
        })
    },

    coursesByTeacher(teacherId) {
        return db(TBL_COURSE).where({
            lecturers_id: teacherId,
        })
    },

    createCourse(course) {
        return db(TBL_COURSE).insert(course);
    },

    updateCourse(courseId, course) {
        return db(TBL_COURSE)
            .where({
                course_id: courseId
            })
            .update(course);
    },

    getCouresByTeacherId(teacherId) {
        return db(TBL_COURSE)
            // .select(
            //     [
            //         `${TBL_COURSE}.*`,
            //         'user.user_id as lecturer_id',
            //         'user.first_name as lecturer_first_name',
            //         'user.last_name as lecturer_last_name',
            //     ]
            // )
            .where(
                'lecturers_id', teacherId
            )
        // .innerJoin('user', 'course.lecturers_id', 'user.user_id');
    },

    getAll() {
        return db(TBL_COURSE)
            .select(
                [
                    `${TBL_COURSE}.*`,
                    'user.user_id as lecturer_id',
                    'user.first_name as lecturer_first_name',
                    'user.last_name as lecturer_last_name',
                ]
            )
            .innerJoin('user', 'course.lecturers_id', 'user.user_id');
    },

    getCourseByTopic(topicId, page, limit) {
        if (page && limit) {
            return db(TBL_COURSE)
                .select(
                    [
                        `${TBL_COURSE}.*`,
                        'user.user_id as lecturer_id',
                        'user.first_name as lecturer_first_name',
                        'user.last_name as lecturer_last_name',
                    ]
                )
                .where({
                    topic_id: topicId
                })
                .innerJoin('user', 'course.lecturers_id', 'user.user_id')
                .limit(limit)
                .offset((page - 1) * limit);
        } else {
            return db(TBL_COURSE)
                .select(
                    [
                        `${TBL_COURSE}.*`,
                        'user.user_id as lecturer_id',
                        'user.first_name as lecturer_first_name',
                        'user.last_name as lecturer_last_name',
                    ]
                )
                .where({
                    topic_id: topicId
                })
                .innerJoin('user', 'course.lecturers_id', 'user.user_id');
        }
    },

    getTopRegistedCoursesByTopic(topicId, limit = 6) {
        return db(TBL_COURSE)
            .select(
                [
                    `${TBL_COURSE}.*`,
                    'user.user_id as lecturer_id',
                    'user.first_name as lecturer_first_name',
                    'user.last_name as lecturer_last_name',
                ]
            )
            .where({
                topic_id: topicId
            })
            .innerJoin('user', 'course.lecturers_id', 'user.user_id')
            .orderBy('registed_count', 'desc').limit(limit);
    },

    getDetailCouresById(courseId) {
        return db(TBL_COURSE)
            .select(
                [
                    `${TBL_COURSE}.*`,
                    'user.user_id as lecturer_id',
                    'user.first_name as lecturer_first_name',
                    'user.last_name as lecturer_last_name',
                    'topic.title as topic_name',
                ]
            )
            .where({
                course_id: courseId
            })
            .innerJoin('user', 'course.lecturers_id', 'user.user_id')
            .innerJoin('topic', 'course.topic_id', 'topic.topic_id');
    },

    getCouresByIds(courseIds) {
        return db(TBL_COURSE)
            .select(
                [
                    `${TBL_COURSE}.*`,
                    'user.user_id as lecturer_id',
                    'user.first_name as lecturer_first_name',
                    'user.last_name as lecturer_last_name',
                ]
            )
            .whereIn(
                'course_id', courseIds
            )
            .innerJoin('user', 'course.lecturers_id', 'user.user_id');
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

    update(courseId, course) {
        return db(TBL_COURSE).where({ course_id: courseId })
            .update(course
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
    },

    updateTsv() {
        return db(TBL_COURSE)
            .where('updated_at', '<', Date.now())
            .update({
                'updated_at': Date.now()
            });
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