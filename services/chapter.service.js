const { v4 } = require("uuid");
const chapterModel = require("../models/chapter.model");
const courseModel = require("../models/course.model");

module.exports = {
    async createChapters(user, courseId, chapters) {
        if (user.role != 1) throw 'You do not have permission';
        var courses = await courseModel.courseByTeacher(user.user_id, courseId);
        if (courses.length < 1) throw 'Course does not exist';

        chapters = chapters.map((c) => {
            c.chapter_id = v4();
            c.course_id = courseId;
            return c;
        })
        await chapterModel.createChapters(chapters);

        return chapters;
    },

    async updateChapters(user, courseId, chapters) {
        if (user.role != 1) throw 'You do not have permission';
        var courses = await courseModel.courseByTeacher(user.user_id, courseId);
        if (courses.length < 1) throw 'Course does not exist';

        await chapters.forEach(async (chapter) => {
            await chapterModel.updateChapter(chapter);
        });

        return chapters;
    }
}