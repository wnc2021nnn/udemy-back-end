const db = require('../utils/db');
const TBL_CHAPTER = 'chapter'

module.exports = {
    chaptersByCourse(courseId) {
        return db(TBL_CHAPTER)
            .where('course_id', courseId);
    },
}