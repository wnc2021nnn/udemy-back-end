const db = require('../utils/db');
const TBL_CHAPTER = 'chapter'

module.exports = {
    chaptersByCourse(courseId) {
        return db(TBL_CHAPTER)
            .where('course_id', courseId);
    },

    createChapters(chapters) {
        return db(TBL_CHAPTER)
            .insert(chapters);
    },
    
    updateChapter(chapter){
        return db(TBL_CHAPTER)
        .where('chapter_id', chapter.chapter_id)
        .update(chapter);
    }
}