const { v4 } = require('uuid');
const courseModel = require('../models/course.model');
const lessonLearningStateModel = require('../models/lesson-learning-state.model');
const lessonModel = require('../models/lesson.model')
module.exports = {
    async updateVideoLearningState(learningState) {
        const isStateExist = await lessonLearningStateModel.isExist(learningState.user_id, learningState.lesson_id);
        const now = Date.now();
        if (!isStateExist) {
            learningState = {
                ...learningState,
                "created_at": now,
                "updated_at": now,
                "id": v4(),
            }
            await lessonLearningStateModel.add(learningState);
        } else {
            learningState = {
                ...learningState,
                "updated_at": now,
            }
            await lessonLearningStateModel.updateLearningTime(learningState);

        }
        return learningState;
    },
    async createLessons(user, courseId, lessons) {
        if (user.role != 1)
            throw 'You do not have permission';

        var courses = await courseModel.getDetailCouresById(courseId);

        if (courses.length < 1) throw 'Course does not exist';

        lessons = lessons.map((c) => {
            c.lesson_id = v4();
            return c;
        })

        const res = await lessonModel.createLessons(lessons);

        return res;
    },

    async updateLessons(user, courseId, lessons) {
        if (user.role != 1)
            throw 'You do not have permission';

        var courses = await courseModel.getDetailCouresById(courseId);

        if (courses.length < 1) throw 'Course does not exist';

        await lessons.forEach(async (lesson) => {
            await lessonModel.updateLesson(lesson);
        });
    }
}