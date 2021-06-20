const topicModel = require('../models/topic.model')
const logModel = require('../models/log.model')
const courseModel = require('../models/course.model');

module.exports = {
    async coursesViewedDesFromLastWeek(limit = 4) {
        const lastWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const coursesViewLog = await logModel.coursesViewedWithInCount(lastWeek);
        const limitedCoursesViewLog = coursesViewLog.slice(0, limit);
        const ids = limitedCoursesViewLog.map((l) => l.course_id);
        const courses = await courseModel.getCouresByIds(ids);
        return courses.map((c) => {
            const view_count = coursesViewLog.find((t) => t.course_id === c.course_id).count;
            return {
                ...c,
                view_count
            }
        });
    },

    async increaseRegistedCountByOne(courseId) {
        const course = (await this.getDetailCouresById(courseId))[0];
        if (course) {
            const registedCount = course.registed_count + 1;
            const result = await courseModel.updateRegistedCount(courseId, registedCount);
            return result;
        }
    },

    async increaseViewCountByOne(courseId) {
        const course = (await this.getDetailCouresById(courseId))[0];
        if (course) {
            const viewCount = course.view_count + 1;
            const result = await courseModel.updateViewCount(courseId, viewCount);
            return result;
        }
    },
}
