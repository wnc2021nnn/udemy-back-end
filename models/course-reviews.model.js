const db = require('../utils/db');
const TBL_COURSE_REVIEWS = 'course_reviews'

module.exports = {
    getAll() {
        return db(TBL_COURSE_REVIEWS);
    },
    getReviewsByCourseId(courseId) {
        return db(TBL_COURSE_REVIEWS).where('course_id', courseId);
    },
    add(review) {
        return db(TBL_COURSE_REVIEWS).insert(review);
    },
}