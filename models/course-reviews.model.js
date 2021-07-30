const db = require('../utils/db');
const TBL_COURSE_REVIEWS = 'course_reviews'

module.exports = {
    getAll() {
        return db(TBL_COURSE_REVIEWS);
    },
    getReviewsByCourseId(courseId) {
        return db(TBL_COURSE_REVIEWS)
            .select([
                `${TBL_COURSE_REVIEWS}.*`,
                'user.first_name',
                'user.last_name',
            ])
            .where('course_id', courseId)
            .innerJoin('user', 'user.user_id', `${TBL_COURSE_REVIEWS}.user_id`);
    },
    add(review) {
        return db(TBL_COURSE_REVIEWS).insert(review);
    },
}