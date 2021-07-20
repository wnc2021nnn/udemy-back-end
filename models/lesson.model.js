const db = require('../utils/db');
const TBL_LESSON = 'lesson'

module.exports = {
    lessonsByChapters(chapterIds) {
        return db(TBL_LESSON)
            .whereIn('chapter_id', chapterIds);
    },
    createLessons(lessons) {
        return db(TBL_LESSON)
            .insert(lessons);
    },
    updateLesson(lesson){
        return db(TBL_LESSON)
        .where('lesson_id', lesson.lesson_id)
        .update(lesson);
    }
}